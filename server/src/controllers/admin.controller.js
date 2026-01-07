import RoleRequest from "../models/RoleRequest.js";
import User from "../models/User.js";
import Auction from "../models/Auction.js";
import AuctionConfig from "../models/AuctionConfig.js";
import Category from "../models/Category.js";
import { sendPasswordResetEmail } from "../utils/admin.util.js";

const getCategoryAndDescendants = async (rootId) => {
    let ids = [rootId];
    // Find immediate children
    const children = await Category.find({ parentId: rootId });

    // Recursively find children of children
    for (const child of children) {
        const descendantIds = await getCategoryAndDescendants(child._id);
        ids = [...ids, ...descendantIds];
    }
    return ids;
};

export const getAuctions = async (req, res) => {
  try {
    const {
      search,        // filter by product name
      status,        // filter by 'ongoing' or 'ended'
      categoryId,    // filter by category
      sort,          // e.g. "product:asc,bid:desc"
      page = 1,
    } = req.query;

    const filter = {};

    // 1. Search Logic (Product Name)
    if (search) {
      filter["product.name"] = { $regex: search, $options: "i" };
    }

    // 2. Filter Logic
    if (status && status !== "all") filter.status = status;
    if (categoryId && categoryId !== "all") {
      const categoriesToInclude = await getCategoryAndDescendants(categoryId);
      filter["product.categoryId"] = { $in: categoriesToInclude };
    }

    // 3. Sorting Logic (Matches User Table pattern)
    let sortObj = { createdAt: -1 }; // Default sort
    if (sort) {
      sortObj = {}; 
      const fields = sort.split(",");

      fields.forEach((pair) => {
        const [field, order] = pair.split(":");
        const sortOrder = order === "asc" ? 1 : -1;

        // Map frontend sort keys to DB fields
        if (field === "product") sortObj["product.name"] = sortOrder;
        else if (field === "bid") sortObj["currentPrice"] = sortOrder;
        else if (field === "endTime") sortObj["endTime"] = sortOrder;
        else sortObj[field] = sortOrder;
      });

      if (!sortObj.createdAt) sortObj.createdAt = -1;
    }

    const limit = 9;
    const skip = (page - 1) * limit;

    const [auctions, total] = await Promise.all([
      Auction.find(filter)
        .populate("sellerId", "username email")
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Auction.countDocuments(filter),
    ]);

    return res.status(200).json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalAuctions: total,
      auctions, // Note: returning 'auctions' key
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const deleteAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).json({ message: "Missing auctionId" });
    }

    // 2. Find the auction by ID
    const auction = await Auction.findById(auctionId);

    if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
    }

    // 3. Check if it is already soft-deleted
    if (auction.isDeleted === true) {
        return res.status(400).json({
            message: "Auction already deleted."
        });
    }

    // 4. Perform the soft delete
    auction.isDeleted = true;
    await auction.save();

    return res.status(200).json({
        message: "Auction deleted successfully",
        auction: {
            id: auction._id,
            productName: auction.product.name,
            status: auction.status
        }
    });
      
  } catch (error) {
      return res.status(500).json({message: error.message});
  }
}

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

        if (user.isDeleted === true) {
            return res.status(400).json({
                message: "User already deleted."
            });
        }

        user.isDeleted = true;
        await user.save();

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

    const filter = {
      isDeleted: { $ne: true }
    };

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

      if (!user || user.isDeleted) {
          return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
  } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate a random 8-character password
    const newPassword = Math.random().toString(36).slice(-8);

    // Update password (User model pre-save hook handles the hashing)
    user.passwordHash = newPassword;
    await user.save();

    // Send email to the user
    if (user.email) {
        await sendPasswordResetEmail(user, newPassword);
    }

    res.status(200).json({ 
        message: "Password reset successfully. Email sent to user." 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ 
        message: "Failed to reset password", 
        error: error.message 
    });
  }
};

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
        if (!user || user.isDeleted ) {
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

        if (!user || user.isDeleted) {
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

    if (!user || user.isDeleted) {
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

    if (!user || user.isDeleted) {
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

    pipeline.push({
      $match: { "user.isDeleted": { $ne: true } }
    });

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

    
    const userToPromote = await User.findById(request.userId);
    if (userToPromote && !userToPromote.isDeleted) {
      userToPromote.role = "seller";
      await userToPromote.save();
    } else {
      return res.status(404).json({ message: "User associated with this request is deleted." });
    }
    
    request.status = "approved";
    request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await request.save();

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

export const getAuctionConfig = async (req, res) => {
  try {
    let config = await AuctionConfig.findOne();
    if (!config) {
      config = new AuctionConfig();
      await config.save();
    }
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const { sort, search } = req.query;
    
    let filter = [];
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }; // Case-insensitive
      filter = [
        {
          $match: {
            $or: [
              { name: searchRegex },                 // Match the Parent Name
              { "allDescendants.name": searchRegex } // Match ANY Descendant Name
            ]
          }
        }
      ];
    }

    let sortStage = { createdAt: -1 };

    if (sort) {
      sortStage = {}; 
      const fields = sort.split(",");

      fields.forEach((pair) => {
        const [field, order] = pair.split(":");
        const sortOrder = order === "asc" ? 1 : -1;

        // Map frontend sort keys to DB fields
        if (field === "auctionCount") sortStage["auctionCount"] = sortOrder;
        else if (field === "category") sortStage["name"] = sortOrder;
        else sortStage[field] = sortOrder;
      });

      if (!sortStage.createdAt) sortStage.createdAt = -1;
    }

    const result = await Category.aggregate([
      // STEP 1: Filter Top-Level Only
      { $match: { parentId: null } },

      // STEP 2: Calculate Parent Auction Count (Required for Sorting)
      // We must do this BEFORE pagination to sort correctly by popularity
      {
        $graphLookup: {
          from: "categories",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "allDescendants"
        }
      },
      ...filter,
      {
        $addFields: {
          allCategoryIds: {
            $concatArrays: [["$_id"], "$allDescendants._id"]
          }
        }
      },
      {
        $lookup: {
          from: "auctions",
          let: { categoryIds: "$allCategoryIds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$product.categoryId", "$$categoryIds"] },
                isDeleted: { $ne: true }
              }
            }
          ],
          as: "related_auctions"
        }
      },
      {
        $addFields: {
          auctionCount: { $size: "$related_auctions" }
        }
      },

      // STEP 3: Sort (Must happen before slicing the page)
      { $sort: sortStage },

      // STEP 4: Pagination via Facet
      {
        $facet: {
          // Pipeline A: Get Total Count
          metadata: [{ $count: "total" }],
          
          // Pipeline B: Get Page Data
          data: [
            { $skip: skip },
            { $limit: limit },
            
            // --- OPTIMIZATION: Only lookup children for this page's results ---
            {
              $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "parentId",
                as: "children",
                pipeline: [
                  // A. Find descendants of THIS child
                  {
                    $graphLookup: {
                      from: "categories",
                      startWith: "$_id",
                      connectFromField: "_id",
                      connectToField: "parentId",
                      as: "childDescendants"
                    }
                  },
                  // B. Combine IDs
                  {
                    $addFields: {
                      childAllIds: { $concatArrays: [["$_id"], "$childDescendants._id"] }
                    }
                  },
                  // C. Count Auctions
                  {
                    $lookup: {
                      from: "auctions",
                      let: { ids: "$childAllIds" },
                      pipeline: [
                        { $match: { $expr: { $in: ["$product.categoryId", "$$ids"] }, isDeleted: { $ne: true } } }
                      ],
                      as: "childAuctions"
                    }
                  },
                  // D. Clean up child
                  {
                    $addFields: { auctionCount: { $size: "$childAuctions" } }
                  },
                  { 
                    $project: { 
                      name: 1, slug: 1, image_url: 1, auctionCount: 1, parentId: 1, description: 1,
                    } 
                  },
                  { $sort: { name: 1 } }
                ]
              }
            },
            
            // Final cleanup for the data stream
            { 
              $project: { 
                related_auctions: 0, 
                allDescendants: 0, 
                allCategoryIds: 0 
              } 
            }
          ]
        }
      }
    ]);

    // 5. Unpack the Facet Result
    const data = result[0].data;
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

    res.status(200).json({
      message: "Categories retrieved successfully",
      categories: data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        message: "Failed to get categories list", 
        err: err.message 
    });
  }
};