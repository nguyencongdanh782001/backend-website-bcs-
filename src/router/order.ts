import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Order from "../model/Order";

const router = express.Router();

//get all order
router.get("/all-order", async (req, res) => {
  try {
    const order = await Order.find()
      .populate(["product" as any])
      .sort({ createdAt: -1 });
    return res.json(order);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get order detail
router.get("/detail-order/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id }).populate(
      "product.id_product" as any
    );
    return res.json(order);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create order
router.post("/create-order", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saveOrder = await newOrder.save();

    return res.json(saveOrder);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update order
router.put("/update-order/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update order info
    return res.json(updateOrder);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete order
router.delete("/delete-order/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndRemove(req.params.id);
    //response delete order
    return res.json({ deleteOrder, message: "Order has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
