const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
} = require("../controllers/productController");

router.route("/").post(createProduct).get(getAllProducts);

module.exports = router;
