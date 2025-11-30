import User from "../models/User.js";
import RoleRequest from "../models/RoleRequest.js";
export const requestRole = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.role === "seller")
      return res.status(400).json({ message: "You are already a seller." });

    const existingRequest = await RoleRequest.findOne({
      userId,
      status: "pending",
    });

    if (existingRequest)
      return res
        .status(400)
        .json({ message: "You already have a pending request" });

    const newRequest = await RoleRequest.create({
      userId,
      status: "pending",
      requestedAt: new Date(),
    });

    return res.status(201).json({
      message: "Successfully created a request",
      request: newRequest,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
