const express = require("express");
const {
  createPlans,
  getPlans,
  getPlansByNetwork,
} = require("../controllers/networkPlansController");

const router = express.Router();

router.post("/plans", createPlans);
router.get("/plans", getPlans);
router.get("/plansnet/", getPlansByNetwork);

module.exports = router;
