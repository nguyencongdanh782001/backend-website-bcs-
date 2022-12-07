import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    note: { type: String },
    product: [
      {
        id_product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        amount: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    confirm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("orders", orderSchema);
export default Order;
