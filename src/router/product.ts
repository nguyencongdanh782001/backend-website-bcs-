import express from "express";
import Brand from "../model/Brand";
import Category from "../model/Category";
import Product from "../model/Product";
import { verifyTokenAdmin } from "./../middleware/verifyToken";
const router = express.Router();

// get product follow category
router.get("/filter-category-product", async (req, res) => {
  const { page, limit, cat, brand } = req.query;
  try {
    const startIndex = (Number(page) - 1) * Number(limit);
    if (cat && brand) {
      const thisCategory = await Category.findOne({ slug: cat });
      const thisBrand = await Brand.findOne({ slug: brand });
      const totalProduct = await Product.countDocuments({
        $and: [
          {
            category: (thisCategory as any)._id,
          },
          {
            brand: (thisBrand as any)._id,
          },
        ],
      });
      const product = await Product.find({
        $and: [
          { category: (thisCategory as any)._id },
          {
            brand: (thisBrand as any)._id,
          },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);
      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(totalProduct / Number(limit)),
      });
    } else if (cat) {
      const thisCategory = await Category.findOne({ slug: cat });

      const totalProductCat = await Product.countDocuments({
        category: (thisCategory as any)._id,
      });

      const product = await Product.find({
        category: (thisCategory as any)._id,
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);
      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(totalProductCat / Number(limit)),
      });
    } else {
      const total = await Product.countDocuments({});

      const product = await Product.find()
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);
      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(total / Number(limit)),
      });
    }
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get product sale
router.get("/sale-product", async (req, res) => {
  const { page, limit } = req.query;
  try {
    const startIndex = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments({ sale: { $gt: 0 } });

    const product = await Product.find({ sale: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(startIndex)
      .populate(["category", "brand" as any]);
    return res.json({
      product,
      currentPage: Number(page),
      totalPage: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get product realted
router.get("/relate-product/:id", async (req, res) => {
  const { limit } = req.query;
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    const total = await Product.countDocuments({ category: product.category });

    const randomCount = Math.round(
      Math.random() *
        (total < Number(limit) ? total - total : total - Number(limit))
    );

    const relateProduct = await Product.find({ category: product.category })
      .limit(Number(limit))
      .skip(randomCount)
      .populate(["category", "brand" as any]);

    return res.json({
      relateProduct,
    });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get all product
router.get("/all-product", async (req, res) => {
  try {
    const product = await Product.find()
      .sort({ createdAt: -1 })
      .populate(["category", "brand" as any]);

    return res.json(product);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

// get product detail
router.get("/detail-product/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate([
      "category",
      "brand" as any,
    ]);
    return res.json(product);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//search product
router.get("/search-product", async (req, res) => {
  const { page, limit, searchQuery } = req.query;

  let product;
  try {
    const startIndex = (Number(page) - 1) * Number(limit);

    const data: any  = new RegExp(`${searchQuery}`, "i");

    const cate = await Category.findOne({
      $or: [{ name: data }, { slug: data }],
    });
    const brands = await Brand.findOne({
      $or: [{ name: data }],
    });
    if (cate) {
      const total = await Product.countDocuments({
        $or: [
          { name: data },
          { category: (cate as any)._id },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      });

      product = await Product.find({
        $or: [
          { name: data },
          { category: (cate as any)._id },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);

      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(total / Number(limit)),
      });
    } else if (brands) {
      const total = await Product.countDocuments({
        $or: [
          { name: data },
          { brand: (brands as any)._id },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      });

      product = await Product.find({
        $or: [
          { name: data },
          { brand: (brands as any)._id },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);

      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(total / Number(limit)),
      });
    } else {
      const total = await Product.countDocuments({
        $or: [
          { name: data },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      });

      product = await Product.find({
        $or: [
          { name: data },
          { origin: data },
          { unit: data },
          { desc: data },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(startIndex)
        .populate(["category", "brand" as any]);

      return res.json({
        product,
        currentPage: Number(page),
        totalPage: Math.ceil(total / Number(limit)),
      });
    }
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//Create Product
router.post("/create-product", verifyTokenAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saveProduct = await newProduct.save();

    return res.json(saveProduct);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//Update Product
router.put("/update-product/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update category info
    return res.json(updateProduct);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//Delete Product
router.delete("/delete-product/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndRemove(req.params.id);
    //response delete product
    return res.json({ deleteProduct, message: "product has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});
export default router;
