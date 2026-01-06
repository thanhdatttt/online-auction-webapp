import express from "express";
import {
  sendMessage,
  getConversations,
  getMessages,
  startConversation
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", getConversations);
router.post("/", startConversation);
router.get("/:conversationId", getMessages);
router.post("/:conversationId", sendMessage);

export default router;