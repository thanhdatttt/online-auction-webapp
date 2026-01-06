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
  getAuctions,
  getAuctionConfig,
  deleteAuction,
  getCategories,
} from "../controllers/admin.controller.js";

import { createCategory } from "../controllers/category.controller.js";

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

router.get("/auctions", getAuctions);
router.get("/auction/config", getAuctionConfig);
router.put("/auction/config", updateAuctionConfig);
router.post("/auction/:auctionId/delete", deleteAuction);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
export default router;
