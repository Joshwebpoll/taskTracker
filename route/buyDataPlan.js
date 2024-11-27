const express = require("express");
const { createTransaction } = require("../controllers/buyDataPlan");

const router = express.Router();

router.post("/buydata", createTransaction);

module.exports = router;
