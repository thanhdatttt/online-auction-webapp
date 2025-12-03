import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  approveRoleRequest,
  denyRoleRequest,
  getRoleRequest,
  promoteAdmin,
  getUsers,
  demoteSeller,
  updateAuctionConfig,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/requestRole/approve/:requestId", approveRoleRequest);
router.put("/requestRole/deny/:requestId", denyRoleRequest);
router.put("/promote/:userId", promoteAdmin);
router.put("/demote/:userId", demoteSeller);
router.get("/users", getUsers);
router.get("/requestRole", getRoleRequest);

router.put("/auction/config", updateAuctionConfig);
export default router;
