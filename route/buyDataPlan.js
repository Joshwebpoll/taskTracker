const express = require("express");
const { createTransaction } = require("../controllers/buyDataPlan");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/buydata", protectRoute, createTransaction);

module.exports = router;
