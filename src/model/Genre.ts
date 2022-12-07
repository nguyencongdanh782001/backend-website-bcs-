import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    slug: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

const Genre = mongoose.model("genres", genreSchema);
export default Genre;
