import express from "express";
import { getAvatarUploadSignature, getUploadSignature, getCategoryUploadSignature } from "../controllers/upload.controller.js";

const router = express.Router();

router.get('/sign', getUploadSignature);
router.get('/sign/avatar', getAvatarUploadSignature);
router.get('/sign/category', getCategoryUploadSignature);

export default router;