const express = require("express");
const {
  createPlans,
  getPlans,
  getPlansByNetwork,
} = require("../controllers/networkPlansController");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/plans", protectRoute, createPlans);
router.get("/plans", protectRoute, getPlans);
router.get("/plansnet/", protectRoute, getPlansByNetwork);

module.exports = router;
