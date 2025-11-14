import express from "express";
import { auth, adminOnly } from "../middlewares/auth.js";
import { approveRoleRequest, denyRoleRequest, getRoleRequest } from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/admin/requestRole/approve/:requestId", auth, adminOnly, approveRoleRequest);
router.put("/admin/requestRole/deny/:requestId", auth, adminOnly, denyRoleRequest);
router.put("/admin/make/:userId", auth, adminOnly);
router.get("/admin/requestRole/", auth, adminOnly, getRoleRequest);

export default router;
