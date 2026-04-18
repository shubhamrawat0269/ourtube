import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.files.logo);
    // res.json({ msg: "Users Works" });
    const { password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
  } catch (error) {
    console.error(error.message);
  }

});

router.post("/login", async (req, res) => {
  const { password } = req.body;

  const isMatchPwd = await bcrypt.compare(password, storedHash);
  if(!isMatchPwd) return res.status(401).send("Invalid Cred")

  res.send('Login success')
});

export default router;
