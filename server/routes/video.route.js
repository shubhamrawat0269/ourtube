import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
    const user = req.user;
    /* 1.  Uploading Video and thumbnail to cloudinary */
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

    /* 2. Saving uploaded clourdinary image & video info to db */
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

router.put("/update-video/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;

    /* 1. Get logged-in user (already decoded in middleware)*/
    const user = req.user;

    /* 2. Find video */
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
      });
    }

    /* 3. Authorization check (only owner can update) */
    if (video.userId.toString() !== user.userId) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to update this video",
      });
    }

    /* 4. Prepare update object */
    const updateFields = {};

    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.tags) {
      updateFields.tags = req.body.tags.split(",");
    }

    /* 5. Handle thumbnail update */
    if (req.files && req.files.thumbnail) {
      // Delete old thumbnail from Cloudinary environment
      if (video.thumbnailId) {
        await cloudinary.uploader.destroy(video.thumbnailId);
      }

      // Upload new thumbnail
      const uploadedThumbnail = await cloudinary.uploader.upload(
        req.files.thumbnail.tempFilePath,
      );

      updateFields.thumbnailUrl = uploadedThumbnail.secure_url;
      updateFields.thumbnailId = uploadedThumbnail.public_id;
    }

    /* 6. Update video on DB */
    const updatedVideo = await Video.findOneAndUpdate(
      { _id: videoId },
      { $set: updateFields },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      status: true,
      message: "Video updated successfully",
      data: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

router.delete("/delete-video/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    /* 1. Get logged-in user */
    const user = req.user;

    /* 2. Find video */
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
      });
    }

    /* 3. Authorization check (only owner can delete) */
    if (video.userId.toString() !== user.userId) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to delete this video",
      });
    }

    /* 4. Delete video from Cloudinary */
    if (video.videoId) {
      await cloudinary.uploader.destroy(video.videoId, {
        resource_type: "video",
      });
    }

    /* 5. Delete thumbnail from Cloudinary */
    if (video.thumbnailId) {
      await cloudinary.uploader.destroy(video.thumbnailId);
    }

    /* 6. Delete from DB (modern way) */
    await Video.deleteOne({ _id: videoId });

    res.status(200).json({
      status: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

router.put("/like-video/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
      });
    }

    const alreadyLiked = video.likedBy.includes(userId);
    const alreadyDisliked = video.dislikedBy.includes(userId);

    if (alreadyLiked) {
      // already liked no need to proceed
      return res.status(500).json({ status: false, message: "Already Liked" });
    }

    if (alreadyDisliked) {
      video.dislikes -= 1;
      video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId);
    }

    video.likes += 1;
    video.likedBy.push(userId);
    await video.save();

    return res.status(200).json({
      status: true,
      message: "Video liked",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.put("/dislike-video/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
      });
    }

    const alreadyLiked = video.likedBy.includes(userId);
    const alreadyDisliked = video.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      // already liked no need to proceed
      return res
        .status(500)
        .json({ status: false, message: "Already disliked" });
    }

    if (alreadyLiked) {
      video.likes -= 1;
      video.likedBy = video.likedBy.filter((id) => id.toString() !== userId);
    }

    video.dislikes += 1;
    video.dislikedBy.push(userId);
    await video.save();

    return res.status(200).json({
      status: true,
      message: "Video disliked",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

export default router;
