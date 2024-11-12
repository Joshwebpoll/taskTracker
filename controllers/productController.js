const Product = require("../models/productModel");
const StatusCodes = require("http-status-codes");

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
  // try {
  //   const product = await Product.create(req.body);
  //   res
  //     .status(StatusCodes.CREATED)
  //     .json({ data: product, msg: "created successfully" });
  // } catch (error) {
  //   if (error.name === "ValidationError") {
  //     res
  //       .status(400)
  //       .json({ error: "Invalid user data", details: error.message });
  //   } else {
  //     res.status(500).json({ error: "Server error", details: error.message });
  //   }
  // }
};

const getAllProducts = (req, res) => {
  res.send("all Products");
};

module.exports = { createProduct, getAllProducts };
