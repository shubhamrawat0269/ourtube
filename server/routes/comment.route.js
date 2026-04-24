import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.middleware.js";
import Comment from "../models/comment.model.js";

const router = express.Router();
dotenv.config();

router.get("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({
      videoId,
    })
      .populate("userId", "channelName logoUrl")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false });
  }
});

router.post("/new-comment/:videoId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;
    const { commentText } = req.body;

    const newComment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      userId,
      videoId,
      commentText,
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      status: true,
      message: "Comment added successfully",
      data: savedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

export default router;
