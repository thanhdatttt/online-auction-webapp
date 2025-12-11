import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { approveRoleRequest, denyRoleRequest, getRoleRequest, promoteAdmin, getUsers, demoteSeller, deleteUser, getRequestCount, createUser, getUserbyId, banUser } from "../controllers/admin.controller.js";
import { updateAuctionConfig } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/requestRole/approve/:requestId", adminOnly, approveRoleRequest);
router.post("/requestRole/deny/:requestId", adminOnly, denyRoleRequest);
router.post("/promote/:userId", adminOnly, promoteAdmin);
router.post("/demote/:userId", adminOnly, demoteSeller);
router.get("/users", adminOnly, getUsers);
router.post("/users", adminOnly, createUser);
router.get("/users/:userId", adminOnly, getUserbyId);
router.get("/requestRole", adminOnly, getRoleRequest);
router.get("/requestRole/count", adminOnly, getRequestCount);
router.post("/users/delete/:userId", adminOnly, deleteUser);
router.post("/users/ban/:userId", adminOnly, banUser);

router.put("/auction/config", adminOnly, updateAuctionConfig);
export default router;
