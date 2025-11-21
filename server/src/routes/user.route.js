import express from "express";
import { getMe, changeEmail, changeName, changeAddress, changeBirth, changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", getMe);
router.patch("/me/email", changeEmail);
router.patch("/me/fullname", changeName);
router.patch("/me/address", changeAddress);
router.patch("/me/birth", changeBirth);
router.patch("/me/password", changePassword);

export default router;