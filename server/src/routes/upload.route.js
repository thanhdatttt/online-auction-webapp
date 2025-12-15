import express from "express";
import { getAvatarUploadSignature, getUploadSignature } from "../controllers/upload.controller.js";

const router = express.Router();

router.get('/sign', getUploadSignature);
router.get('/sign/avatar', getAvatarUploadSignature);

export default router;