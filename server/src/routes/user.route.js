import express from "express";
import {
  getMe,
  changeEmail,
  changeName,
  changeAddress,
  changeBirth,
  changePassword,
  changeAvatar,
  requestRole,
} from "../controllers/user.controller.js";
import {
  getCreatedAuctions,
  getActiveBids,
  getWonAuctions,
  getFeedbacks,
} from "../controllers/list.controller.js";

const router = express.Router();

router.get("/me", getMe);
router.patch("/me/email", changeEmail);
router.patch("/me/avatar", changeAvatar);
router.patch("/me/fullname", changeName);
router.patch("/me/address", changeAddress);
router.patch("/me/birth", changeBirth);
router.patch("/me/password", changePassword);
router.post("/me/requestRole", requestRole);

router.get("/me/won-auctions", getWonAuctions);
router.get("/me/created-auctions", getCreatedAuctions);
router.get("/me/active-bids", getActiveBids);
router.get("/me/feedbacks", getFeedbacks);

export default router;
