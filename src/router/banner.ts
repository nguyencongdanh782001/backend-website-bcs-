import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Banner from "../model/Banner";

const router = express.Router();
//get all banner
router.get("/all-banner", async (req, res) => {
  try {
    const banner = await Banner.find().sort({ createdAt: -1 });
    return res.json(banner);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create banner
router.post("/create-banner", verifyTokenAdmin, async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    const saveBanner = await newBanner.save();

    return res.json(saveBanner);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update banner
router.put("/update-banner/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update banne info
    return res.json(updateBanner);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete banner
router.delete("/delete-banner/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteBanner = await Banner.findByIdAndRemove(req.params.id);
    //response delete banner
    return res.json({ deleteBanner, message: "banner has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
