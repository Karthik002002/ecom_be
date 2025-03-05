import express from "express";
import { authMiddleware } from "../Middleware/Autheticatetoken.js";
import { Product } from "../Model/ProductModel.js";
import multer from "multer";
import path from "path";

const ProductRouter = express.Router();

ProductRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, price, ...optionalFields } = req.body;
    if (!product_name || !price) {
      return res
        .status(400)
        .json({ messagge: "product_name and price are required." });
    }

    const product = await Product.findByPk(id);
    await product.update({ product_name, price, ...optionalFields });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: `Internal server Error `, error });
  }
});

// Get all product
ProductRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get One Product by passing id param as pk
ProductRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

export { ProductRouter };
