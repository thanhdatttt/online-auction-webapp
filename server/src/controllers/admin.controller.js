import RoleRequest from "../models/RoleRequest.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const {username, page = 1} = req.query;

        const filter = {};

        if (username) filter.username = {$regex: username, $options: "i"};
        
        const limit = 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("_id email avatar_url role status createdAt")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total/limit);

        return res.status(200).json({
            page: Number(page),
            totalPages,
            totalUsers: total,
            users,
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

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
                role: user.role
            }
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getRoleRequest = async (req, res) => {
    try {
        const {status, page = 1} = req.query;

        const filter = {};

        if (status) filter.status = status;
        
        const limit = 10;
        const skip = (page - 1) * limit;

        const [requests, total] = await Promise.all([
            RoleRequest.find(filter)
                .populate("userId", "username email role")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit),
            RoleRequest.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total/limit);

        return res.status(200).json({
            page: Number(page),
            totalPages,
            totalRequests: total,
            requests,
        });

    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

export const approveRoleRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await RoleRequest.findById(requestId);

        if (!request)
            return res.status(404).json({ message: "Request not found" });

        if (request.status !== "pending")
            return res.status(400).json({ message: "Request already processed" });

        request.status = "approved";
        request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await request.save();

        await User.findByIdAndUpdate(request.userId, { role: "seller" });

        res.json({ message: "Seller role approved for 7 days." });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
};


export const denyRoleRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await RoleRequest.findById(requestId);
        
        if (!request) 
            return res.status(404).json({ message: "Request not found" });

        if (request.status !== "pending")
            return res.status(400).json({ message: "Request already processed" });

        // Deny
        request.status = "denied";
        request.expiresAt = null;
        await request.save();

        res.json({ message: "Role request denied." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
