import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genres",
    },
    name: {
      type: String,
      required: true,
      unique: false,
    },
    desc: {
      type: String,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    slug: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("categories", categorySchema);
export default Category;
