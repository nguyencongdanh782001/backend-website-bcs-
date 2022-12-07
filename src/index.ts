import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoute from "./router/auth";
import bannerRoute from "./router/banner";
import brandRoute from "./router/brand";
import categoryRoute from "./router/category";
import productRoute from "./router/product";
import userRoute from "./router/user";
import blogRoute from "./router/blog";
import featureCategoryRoute from "./router/featureCategory";
import genreRoute from "./router/genre";
import famousBrandRoute from "./router/famousBrand";
import orderRoute from "./router/order";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/genre", genreRoute);
app.use("/api/category", categoryRoute);
app.use("/api/feature-category", featureCategoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/banner", bannerRoute);
app.use("/api/famous-brand", famousBrandRoute);
app.use("/api/order", orderRoute);

const connectDB = async () => {  
  console.log(process.env.CONNECT_URL);
  
  try {
    await mongoose.connect(`${process.env.CONNECT_URL}`);
    console.log("connect mongoose success");
  } catch (error) {
    console.log(`connect mongoose fail, error: ${error}`);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`backend server is running on PORT: ${PORT}`);
});
