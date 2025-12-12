import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { approveRoleRequest, denyRoleRequest, getRoleRequest, promoteAdmin, getUsers, demoteSeller, deleteUser, getRequestCount, createUser, getUserbyId, updateUserStatus } from "../controllers/admin.controller.js";
import { updateAuctionConfig } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/requestRole/:requestId/approve", adminOnly, approveRoleRequest);
router.post("/requestRole/:requestId/deny", adminOnly, denyRoleRequest);
router.post("/:userId/promote", adminOnly, promoteAdmin);
router.post("/:userId/demote", adminOnly, demoteSeller);
router.get("/users", adminOnly, getUsers);
router.post("/users", adminOnly, createUser);
router.get("/users/:userId", adminOnly, getUserbyId);
router.get("/requestRole", adminOnly, getRoleRequest);
router.get("/requestRole/count", adminOnly, getRequestCount);
router.post("/users/:userId/delete", adminOnly, deleteUser);
router.patch("/users/:userId/status", adminOnly, updateUserStatus);

router.put("/auction/config", adminOnly, updateAuctionConfig);
export default router;
