import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message (Start new conversation OR reply)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, conversationId, text } = req.body;

    let targetConversationId = conversationId;

    // CASE 1: Starting a new chat via Recipient ID
    if (!targetConversationId && recipientId) {
      // Check if conversation already exists between these two users
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      // If not, create it
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
        });
      }
      targetConversationId = conversation._id;
    }

    if (!targetConversationId) {
      return res.status(400).json({ message: "Conversation ID or Recipient ID required." });
    }

    // Create the message
    const newMessage = await Message.create({
      conversationId: targetConversationId,
      senderId: senderId,
      text: text,
    });

    // Update conversation with last message reference and time
    await Conversation.findByIdAndUpdate(targetConversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date(), // Force update timestamp for sorting
    });

    // Populate sender info for immediate frontend display
    const populatedMessage = await newMessage.populate(
      "senderId",
      "firstName lastName avatar_url"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
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

    const messages = await Message.find({ query })
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