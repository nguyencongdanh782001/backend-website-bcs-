import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

dotenv.config();
const router = express.Router();

//REGITSER
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    //check user existed
    if (existingUser) return res.status(409).send("username already existed");
    //check confirm password math
    if (req.body.password !== req.body.confirmpassword)
      return res.status(400).send("confirm password is not math");
    //encrypted password
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      `${process.env.PASS_SEC}`.toString()
    );
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
      isAdmin: req.body.isAdmin,
    });
    //save new user
    const saveUser = await newUser.save();
    //response user
    return res.json(saveUser);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    //check existed user
    if (!existingUser)
      return res.status(401).send("incorrect username or password");
    // decrypted password and parse to string
    const decryptedPassword = await CryptoJS.AES.decrypt(
      existingUser.password,
      `${process.env.PASS_SEC}`
    );
    const origianlPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    //check password
    if (origianlPassword !== req.body.password)
      return res.status(401).send("incorrect username or password");
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        username: existingUser.username,
        isAdmin: existingUser.isAdmin,
      },
      `${process.env.TOKEN_SECRET}`,
      { expiresIn: "3d" }
    );
    const { password, ...orther } = existingUser._doc;
    //response user
    return res.json({ ...orther, accessToken });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
