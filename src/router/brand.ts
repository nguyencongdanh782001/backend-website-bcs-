import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Brand from "../model/Brand";

const router = express.Router();

//get all brand
router.get("/all-brand", async (req, res) => {
  try {
    const brand = await Brand.find()
    .populate(["category" as any]);
    return res.json(brand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get brand detail
router.get("/detail-brand/:id", async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.id });
    return res.json(brand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get brand
router.get("/slug-brand", async (req, res) => {
  const { brand } = req.query;
  try {
    const brandSlug = await Brand.findOne({ slug: brand }).populate([
      "category" as any,
    ]);
    return res.json(brandSlug);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create brand
router.post("/create-brand", verifyTokenAdmin, async (req, res) => {
  try {
    const newBrand = new Brand({
      name: req.body.name,
      category: req.body.category,
      desc: req.body.desc,
      slug: req.body.slug,
    });
    const saveBrand = await newBrand.save();

    return res.json(saveBrand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update brand
router.put("/update-brand/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update banne info
    return res.json(updateBrand);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete brand
router.delete("/delete-brand/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteBrand = await Brand.findByIdAndRemove(req.params.id);
    //response delete brand
    return res.json({ deleteBrand, message: "Brand has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
