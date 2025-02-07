const express = require("express");

const {
  initailPaymentToWallet,
  getWebHookInformations,
} = require("../controllers/addPaymentToWallet");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/add-payment", protectRoute, initailPaymentToWallet);
router.post("/web-hook", getWebHookInformations);

module.exports = router;
