import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    title: {
      type: String,
      required: true,
      unique: false,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blogs", blogSchema);
export default Blog;
