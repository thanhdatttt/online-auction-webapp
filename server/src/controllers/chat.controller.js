import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// Send a message (Start new conversation OR reply)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;

    if (!text) return res.status(400).json({ message: "Message text required" });

    const newMessage = await Message.create({
      conversationId,
      senderId,
      text,
    });

    // 2. Update the conversation (lastMessage + timestamp)
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date(), // Updates the 'updatedAt' field for sorting conversation list
    }, { new: true }).populate("participants");

    // 3. Populate and return
    const populatedMessage = await newMessage.populate(
      "senderId",
      "firstName lastName avatar_url"
    );

    const io = req.app.get("io"); // Get IO instance from app
    
    if (conversation && io) {
      conversation.participants.forEach(participant => {
        // Emit to everyone in the conversation (sender AND receiver)
        // This ensures the receiver gets the bubble update, and sender confirms receipt
        io.to(`user_${participant._id.toString()}`).emit("newMessage", populatedMessage);
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const startConversation = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) return res.status(400).json({ message: "Recipient ID required" });

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    // If not, create it
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
      });
    }

    // Populate user details so frontend can display immediately
    await conversation.populate("participants", "firstName lastName avatar_url");

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for the sidebar
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "firstName lastName avatar_url email",
      })
      .populate({
        path: "lastMessage",
        select: "text senderId createdAt isRead",
      })
      .sort({ updatedAt: -1 }); // Most recent first

    // Transform data for easier frontend consumption
    const formattedConversations = conversations.map((conv) => {
      // Find the "other" participant
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId
      );

      return {
        id: conv._id,
        otherUser: otherUser, // Frontend can grab name/avatar from here
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt,
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get message history for a specific chat
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { cursor } = req.query; // The _id of the oldest message currently loaded on client
    const LIMIT = 50;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const query = { conversationId };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await Message.find(query)
      .populate("senderId", "firstName lastName avatar_url")
      .sort({ _id: -1 }) // Oldest first (chat style)
      .limit(LIMIT);
    
    const nextCursor = messages.length === LIMIT ? messages[messages.length - 1]._id : null;

    res.status(200).json({
      messages: messages.reverse(),
      nextCursor, // Client sends this back when scrolling up
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};