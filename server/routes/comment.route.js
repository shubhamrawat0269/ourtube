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

router.delete(
  "/delete-comment/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.userId;

      // 1. Find comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          status: false,
          message: "Comment not found",
        });
      }

      // 2. Authorization (only owner can delete)
      if (comment.userId.toString() !== userId) {
        return res.status(403).json({
          status: false,
          message: "Unauthorized to delete this comment",
        });
      }

      // 3. Delete comment
      await Comment.deleteOne({ _id: commentId });

      return res.status(200).json({
        status: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
  },
);

router.put("/edit-comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    // 1. Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }

    // 2. Authorization (only owner can edit)
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to edit this comment",
      });
    }

    // 3. Update comment
    comment.commentText = text.trim();
    comment.isEdited = true;

    const updatedComment = await comment.save();

    res.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: updatedComment,
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
