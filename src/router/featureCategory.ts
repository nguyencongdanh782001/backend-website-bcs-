import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Category from "../model/Category";
import FeatureCategory from "../model/FeatureCategory";

const router = express.Router();
//get all feature category
router.get("/all-feature-category", async (req, res) => {
  try {
    const featureCategory = await FeatureCategory.find()
    .populate(["category" as any, "genre" as any]);
    return res.json(featureCategory);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get feature category detail
router.get("/detail-feature-category/:id", async (req, res) => {
  try {
    const category = await FeatureCategory.findOne({
      _id: req.params.id,
    });
    return res.json(category);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create feature category
router.post("/create-feature-category", verifyTokenAdmin, async (req, res) => {
  try {
    const cat = await Category.findById(req.body.category);
    const newFeatureCategory = new FeatureCategory({
      ...req.body,
      genre: cat.genre,
    });
    const saveFeatureCategory = await newFeatureCategory.save({
      ...req.body,
      genre: cat.genre,
    });

    return res.json(saveFeatureCategory);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update feature category
router.put(
  "/update-feature-category/:id",
  verifyTokenAdmin,
  async (req, res) => {
    try {
      let data = { ...req.body };
      if (req.body.category) {
        const cat = await Category.findById(req.body.category);
        data = { ...req.body, genre: cat.genre };
      }
      const updateFeatureCategory = await FeatureCategory.findByIdAndUpdate(
        req.params.id,
        {
          $set: data,
        },
        { new: true }
      );
      //response update feature category info
      return res.json(updateFeatureCategory);
    } catch (error: any) {
      //response error from server
      return res.status(500).send(error.message);
    }
  }
);

//delete feature category
router.delete(
  "/delete-feature-category/:id",
  verifyTokenAdmin,
  async (req, res) => {
    try {
      const deleteFeatureCategory = await FeatureCategory.findByIdAndRemove(
        req.params.id
      );
      //response delete feature category
      return res.json({
        deleteFeatureCategory,
        message: "feature category has been delete.",
      });
    } catch (error: any) {
      //response error from server
      return res.status(500).send(error.message);
    }
  }
);

export default router;
