import cron from "node-cron";
import RoleRequest from "../models/RoleRequest.js";
import User from "../models/User.js";

// Run every hour
cron.schedule("*/5 * * * *", async () => {
  const now = new Date();

  const expiredRequests = await RoleRequest.find({
    status: "approved",
    expiresAt: { $lte: now }
  });

  for (const req of expiredRequests) {
    await User.findByIdAndUpdate(req.userId, { role: "bidder" });

    req.status = "expired";
    await RoleRequest.findByIdAndDelete(req.id);
  }

  console.log(`Checked expiration: ${expiredRequests.length} reverted.`);
});
