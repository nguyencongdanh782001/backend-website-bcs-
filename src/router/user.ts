import CryptoJS from "crypto-js";
import express from "express";
import { verifyToken, verifyTokenAdmin } from "../middleware/verifyToken";
import User from "../model/User";

const router = express.Router();

//UPDATE USER INFO
router.put("/update-user/:id", verifyTokenAdmin, async (req, res) => {
  try {
    if (req.body.password) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        req.body.password,
        `${process.env.PASS_SEC}`.toString()
      );
      const password = new User({ password: encryptedPassword });

      //update user info
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { password: password.password },
        },
        { new: true }
      );
      //response update user info
      return res.json(updateUser);
    }
    if (req.body.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      //check username or email existed
      if (existingUser)
        return res.status(409).send("already have someone using username ");

      //update user info
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      //response update user info
      return res.json(updateUser);
    }
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//CHECK PASSWORD
router.post("/check-user-password", verifyTokenAdmin, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User has not existed");
    } else {
      // decrypted password and parse to string
      const decryptedPassword = await CryptoJS.AES.decrypt(
        user.password,
        `${process.env.PASS_SEC}`
      );
      const origianlPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
      //check password
      if (origianlPassword !== req.body.oldPassword)
        return res.status(401).send("incorrect username or password");
      return res.json({ oldPassword: true });
    }
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
});

//DELETE USER
router.delete("/delete-user/:id", verifyTokenAdmin, async (req, res) => {
  try {
    //delete user
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    return res.json({ deleteUser, message: "user has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//GET A CURRENT USER
router.get("/current-user", verifyToken, async (req: any, res) => {
  try {
    //get user
    const user = await User.findById(req.user.id);

    const { password, ...orther } = user._doc;
    //response user
    return res.json({ ...orther });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//GET USER (FIND USER)
router.get("/find-user/:id", verifyTokenAdmin, async (req, res) => {
  try {
    //get user
    const user = await User.findById(req.params.id);

    const { password, ...orther } = user._doc;
    //response user
    return res.json({ ...orther });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//GET ALL USER
router.get("/all-user", verifyTokenAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    //get user
    const user = query
      ? await User.find().sort({ createdAt: -1 }).limit(5)
      : await User.find().sort({ createdAt: -1 });
    //response user
    return res.json(user);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//GET USER STATS
// router.get("/stats", verifyTokenAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     return res.json(data);
//   } catch (error: any) {
//     //response error from server
//     return res.status(500).send(error.message);
//   }
// });

export default router;
