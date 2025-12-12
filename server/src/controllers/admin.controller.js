import RoleRequest from "../models/RoleRequest.js";
import User from "../models/User.js";

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "User deleted successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
        
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ field: "email", message: "Email already in use" });
    }

    // Check if username exists
    const existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ field: "username", message: "Username already in use" });
    }

    // Create user (password hashing is handled in User model pre-save)
    const newUser = await User.create({
      email,
      username,
      passwordHash: password,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const getUsers = async (req, res) => {
  try {
    const {
      search,        // full text search (username or email)
      status,        // specific status
      role,          // specific role
      sort,
      page = 1,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (role) filter.role = role;

    // --- Multi-field sorting ---
    let sortObj = { createdAt: -1 }; // default

    if (sort) {
      sortObj = {}; // reset
      const fields = sort.split(",");

      fields.forEach((pair) => {
        const [field, order] = pair.split(":");
        sortObj[field] = order === "asc" ? 1 : -1;
      });

      // If createdAt not specified, add default
      if (!sortObj.createdAt) sortObj.createdAt = -1;
    }

    const limit = 8;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("_id username email avatar_url role status createdAt")
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      page: Number(page),
      totalPages,
      totalUsers: total,
      sortApplied: sortObj,
      users,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserbyId = async (req, res) => {
  try {
      const { userId } = req.params;

      if (!userId) {
          return res.status(400).json({ message: "Missing userId" });
      }

      const user = await User.findById(userId).select("-passwordHash -refreshToken -updatedAt -__v"); 
      // exclude password for safety

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
  } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
  }
}

export const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const allowed = ["active", "banned"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        // get user
        const user = await User.findById(userId).select("_id username role status");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ⭐ RULE: cannot ban admin
        if (user.role === "admin" && status === "banned") {
            return res.status(403).json({
                message: "Admins cannot be banned."
            });
        }

        user.status = status;
        await user.save();

        return res.status(200).json({
            message: `User status updated to '${status}'.`,
            user: user
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        const {
            firstName,
            lastName,
            email,
            address,
            birthday,
            role
        } = req.body;

        const user = await User.findById(userId).select("-passwordHash -refreshToken -providers");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === "admin" && role && role !== "admin") {
            return res.status(400).json({
                message: "Cannot change the role of an admin user."
            });
        }

        // Apply updates
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) user.email = email;
        if (address !== undefined) user.address = address;
        if (role !== undefined) user.role = role;

        // Birth date from shadcn-calendar is a JS Date string → cast safely
        if (birthday !== undefined) {
            const parsedDate = birthday ? new Date(birthday + "T00:00:00") : null;
            if (parsedDate && isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Invalid birth date format." });
            }
            parsedDate.setHours(12, 0, 0, 0); 
            user.birth = parsedDate;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully.",
            user
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const promoteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// demote seller user to bidder
export const demoteSeller = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "bidder") {
      return res.status(400).json({ message: "User is already a bidder" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Can't demote an admin" });
    }

    user.role = "bidder";
    await user.save();

    res.status(200).json({
      message: "User demoted to bidder successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRequestCount = async (req, res) => {
  try {
    // Count all requests
    const count = await RoleRequest.countDocuments();

    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export const getRoleRequest = async (req, res) => {
  try {
    const { search, sort, page = 1 } = req.query;

    const limit = 8;
    const skip = (page - 1) * limit;

    let sortObj = { requestedAt: -1 }; // default
    if (sort) {
      sortObj = {};
      sort.split(",").forEach((pair) => {
        const [field, order] = pair.split(":");
        if (field === "username") sortObj["user.username"] = order === "asc" ? 1 : -1;
        else if (field === "requestedAt") sortObj.requestedAt = order === "asc" ? 1 : -1;
      });
      if (!sortObj.requestedAt) sortObj.requestedAt = -1;
    }

    // --- Build aggregation pipeline ---
    const pipeline = [];
    
    pipeline.push({ $match: { status: "pending" } });

    // Populate user
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    });
    pipeline.push({ $unwind: "$user" });

    // Search by username
    if (search && search.trim() !== "") {
      pipeline.push({
        $match: { "user.username": { $regex: search.trim(), $options: "i" } }
      });
    }

    // Sort
    pipeline.push({ $sort: sortObj });

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Select fields to return
    pipeline.push({
      $project: {
        _id: 1,
        status: 1,
        requestedAt: 1,
        user: {
          username: 1,
          email: 1,
          role: 1,
          avatar_url: 1,
        },
      }
    });

    // --- Execute queries in parallel ---
    const [requests, totalResult] = await Promise.all([
      RoleRequest.aggregate(pipeline),
      RoleRequest.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        ...(search && search.trim() !== "" ? [{
          $match: { "user.username": { $regex: search.trim(), $options: "i" } }
        }] : []),
        { $count: "total" }
      ])
    ]);

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      page: Number(page),
      totalPages,
      totalRequests: total,
      sortApplied: sortObj,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// approve promote request
export const approveRoleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await RoleRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    request.status = "approved";
    request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await request.save();

    await User.findByIdAndUpdate(request.userId, { role: "seller" });

    res.json({ message: "Seller role approved for 7 days." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// deny promote request
export const denyRoleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await RoleRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    // Deny
    request.status = "denied";
    request.expiresAt = null;
    await RoleRequest.findByIdAndDelete(requestId);

    res.json({ message: "Role request denied." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update auction config 
export const updateAuctionConfig = async (req, res) => {
  try {
    const { extendThreshold, extendDuration } = req.body;

    let config = await AuctionConfig.findOne();
    if (!config) {
      config = new AuctionConfig({ extendThreshold, extendDuration });
    } else {
      config.extendThreshold = extendThreshold;
      config.extendDuration = extendDuration;
    }
    await config.save();
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
