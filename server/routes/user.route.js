import express from "express";
const router = express.Router();

router.post("/signup", (req, res) => {
  // console.log(req.body);
  console.log(req.files.logo);
  res.json({ msg: "Users Works" });
});

export default router;
