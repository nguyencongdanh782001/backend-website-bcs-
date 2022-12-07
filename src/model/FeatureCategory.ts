import mongoose from "mongoose";

const featureCategorySchema = new mongoose.Schema(
  {
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genres",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
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
  { timestamps: true }
);

const FeatureCategory = mongoose.model(
  "feature_categories",
  featureCategorySchema
);

export default FeatureCategory;
