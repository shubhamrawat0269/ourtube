import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Video from "../models/video.model.js";
import { v2 as cloudinary } from "cloudinary";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload-video", authMiddleware, async (req, res) => {
  try {
    /* 1. After verify token */
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);

    /* 2.  Uploading Video and thumbnail to cloudinary */
    const uploadedVideo = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
      },
    );
    const uploadedThumbnail = await cloudinary.uploader.upload(
      req.files.thumbnail.tempFilePath,
    );

    // console.log({ uploadedVideo, uploadedThumbnail });

    /* 3. Saving uploaded clourdinary image & video info to db */
    const newUploadedVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      description: req.body.description,
      userId: user.userId,
      videoUrl: uploadedVideo.secure_url,
      videoId: uploadedVideo.public_id,
      thumbnailUrl: uploadedThumbnail.secure_url,
      thumbnailId: uploadedThumbnail.public_id,
      category: req.body.category,
      tags: req.body.tags.split(","),
    });
    const newUploadedVideoData = await newUploadedVideo.save();

    res.status(201).json({
      status: true,
      message: "Video Uploaded Successfully",
      data: newUploadedVideoData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

export default router;
