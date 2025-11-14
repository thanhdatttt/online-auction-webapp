import express from "express";
import { auth, adminOnly } from "../middlewares/auth.js";
import { approveRoleRequest, denyRoleRequest, getRoleRequest, promoteAdmin, getUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/requestRole/approve/:requestId", adminOnly, approveRoleRequest);
router.put("/requestRole/deny/:requestId", adminOnly, denyRoleRequest);
router.put("/promote/:userId", adminOnly, promoteAdmin);
router.get("/users", adminOnly, getUsers);
router.get("/requestRole/", adminOnly, getRoleRequest);

export default router;
