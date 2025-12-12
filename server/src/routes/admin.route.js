import express from "express";

import {
  approveRoleRequest,
  denyRoleRequest,
  getRoleRequest,
  promoteAdmin,
  getUsers,
  demoteSeller,
  deleteUser, getRequestCount, createUser, getUserbyId, updateUserStatus,
  updateAuctionConfig,
  updateUserInfo,
} from "../controllers/admin.controller.js";


const router = express.Router();

router.post("/requestRole/:requestId/approve", approveRoleRequest);
router.post("/requestRole/:requestId/deny", denyRoleRequest);
router.post("/:userId/promote", promoteAdmin);
router.post("/:userId/demote", demoteSeller);
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/requestRole", getRoleRequest);
router.get("/requestRole/count", getRequestCount);
router.get("/users/:userId", getUserbyId);
router.patch("/users/:userId", updateUserInfo);
router.post("/users/:userId/delete", deleteUser);
router.patch("/users/:userId/status", updateUserStatus);

router.put("/auction/config", updateAuctionConfig);
export default router;
