import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { approveRoleRequest, denyRoleRequest, getRoleRequest, promoteAdmin, getUsers, demoteSeller } from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/requestRole/approve/:requestId", adminOnly, approveRoleRequest);
router.put("/requestRole/deny/:requestId", adminOnly, denyRoleRequest);
router.put("/promote/:userId", adminOnly, promoteAdmin);
router.put("/demote/:userId", adminOnly, demoteSeller);
router.get("/users", adminOnly, getUsers);
router.get("/requestRole", adminOnly, getRoleRequest);

export default router;
