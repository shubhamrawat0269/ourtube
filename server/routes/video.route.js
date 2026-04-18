import express from "express";
import mongoose from "mongoose";

import Video from "../models/video.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/upload-video", authMiddleware, async (req, res) => {
  try {
    res.status(201).json({
      status: true,
      message: "Video created successfully",
      data: [],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

export default router;
