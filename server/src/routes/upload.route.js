import express from "express";
import { getUploadSignature } from "../controllers/upload.controller.js";

const router = express.Router();

router.get('/sign', getUploadSignature);

export default router;