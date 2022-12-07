import mongoose from "mongoose";

const famousSchema = new mongoose.Schema(
  {
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
  { timestamps: true }
);

const FamousBrand = mongoose.model("famous_brands", famousSchema);

export default FamousBrand;
