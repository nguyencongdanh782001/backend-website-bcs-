import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Blog from "../model/Blog";
import Category from "../model/Category";

const router = express.Router();

//get all blog
router.get("/all-blog", async (req, res) => {
  try {
    const blog = await Blog.find()
    .populate(["category" as any]);
    return res.json(blog);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//get filter blog
router.get("/filter-cate-blog", async (req, res) => {
  const { catSlug } = req.query;
  try {
    const thisCategory = await Category.findOne({ slug: catSlug });
    const blog = await Blog.findOne({
      category: (thisCategory as any)._id,
    })
      .sort({ createdAt: -1 })
      .populate(["category" as any]);
    return res.json(blog);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get blog detail
router.get("/detail-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id }).populate([
      "category" as any,
    ]);
    return res.json(blog);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create blog
router.post("/create-blog", verifyTokenAdmin, async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const saveBlog = await newBlog.save();

    return res.json(saveBlog);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update blog
router.put("/update-blog/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update blog info
    return res.json(updateBlog);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete blog
router.delete("/delete-blog/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteBlog = await Blog.findByIdAndRemove(req.params.id);
    //response delete blog
    return res.json({ deleteBlog, message: "blog has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
