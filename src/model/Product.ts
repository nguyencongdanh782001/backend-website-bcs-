import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id_product: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
    introduce: {
      type: String,
    },
    desc: {
      type: String,
    },
    unit: {
      type: String,
    },
    origin: {
      type: String,
      required: true,
    },
    instock: {
      type: Boolean,
      required: true,
      default: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sale: {
      type: Number,
      default: 0,
    },
    image: [
      {
        name: {
          type: String,
          required: true,
        },
        instock: {
          type: Boolean,
          required: true,
          default: true,
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
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);
export default Product;
