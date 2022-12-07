import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import FamousBrand from "../model/FamousBrand";

const router = express.Router();
//get all famous brand
router.get("/all-famous-brand", async (req, res) => {
  try {
    const famousBrand = await FamousBrand.find();
    return res.json(famousBrand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create famous brand
router.post("/create-famous-brand", verifyTokenAdmin, async (req, res) => {
  try {
    const newFamousBrand = new FamousBrand(req.body);
    const saveFamousBrand = await newFamousBrand.save();

    return res.json(saveFamousBrand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update famous brand
router.put("/update-famous-brand/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateFamousBrand = await FamousBrand.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update famous brand info
    return res.json(updateFamousBrand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete famous brand
router.delete(
  "/delete-famous-brand/:id",
  verifyTokenAdmin,
  async (req, res) => {
    try {
      const deleteFamousBrand = await FamousBrand.findByIdAndRemove(
        req.params.id
      );
      //response delete FamousBrand
      return res.json({
        deleteFamousBrand,
        message: "FamousBrand has been delete.",
      });
    } catch (error: any) {
      //response error from server
      return res.status(500).send(error.message);
    }
  }
);

export default router;
