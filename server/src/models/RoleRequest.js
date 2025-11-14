import mongoose from "mongoose";

const RoleRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
    requestedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // only set when approved
});

export default mongoose.model("RoleRequest", RoleRequestSchema);