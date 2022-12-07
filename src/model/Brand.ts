import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
    name: {
      type: String,
      required: true,
      unique: false,
    },
    desc: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("brands", brandSchema);
export default Brand;
