import express from "express";
const router = express.Router();

router.post("/signup", (req, res) => res.json({ msg: "Users Works" }));

export default router;