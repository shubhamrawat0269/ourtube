import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/signup", async (req, res) => {
  try {
    const { channelName, email, phone, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const uploadedImage = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
    );

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      email,
      phone,
      password: hashedPwd,
      logoUrl: uploadedImage.secure_url,
      logoId: uploadedImage.public_id,
    });
    await newUser.save();

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { password } = req.body;

  const isMatchPwd = await bcrypt.compare(password, storedHash);
  if (!isMatchPwd)
    return res
      .status(401)
      .json({ status: false, message: "Invalid Credentials" });

  res.json({ status: true, message: "Login successful" });
});

export default router;
