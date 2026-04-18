import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

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

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid Credentials",
      });
    }

    // 3. Compare password
    const isMatchPwd = await bcrypt.compare(password, user.password);
    if (!isMatchPwd) {
      return res.status(401).json({
        status: false,
        message: "Invalid Credentials",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        channelName: user.channelName,
        phone: user.phone,
        logoId: user.logoId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" },
    );

    // 5. Send response
    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        channelName: user.channelName,
        logoId: user.logoId,
        logoUrl: user.logoUrl,
        subscribedChannels: user.subscribedChannels,
        subscribers: user.subscribers,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

export default router;
