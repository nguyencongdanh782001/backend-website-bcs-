import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Category from "../model/Category";

const router = express.Router();

//get all category
router.get("/all-category", async (req, res) => {
  try {
    const category = await Category.find()
    .populate(["genre" as any]);
    return res.json(category);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get category detail
router.get("/detail-category/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id }).populate([
      "genre" as any,
    ]);
    return res.json(category);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get category
router.get("/slug-category", async (req, res) => {
  const { cat } = req.query;
  try {
    const category = await Category.findOne({ slug: cat }).populate([
      "genre" as any,
    ]);
    return res.json(category);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create category
router.post("/create-category", verifyTokenAdmin, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const saveCategory = await newCategory.save();

    return res.json(saveCategory);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update category
router.put("/update-category/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update category info
    return res.json(updateCategory);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete category
router.delete("/delete-category/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndRemove(req.params.id);
    //response delete category
    return res.json({ deleteCategory, message: "category has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
