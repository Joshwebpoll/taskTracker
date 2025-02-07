const express = require("express");
const {
  createPlans,
  getPlans,
} = require("../controllers/networkPlansController");

const router = express.Router();

router.post("/plans", createPlans);
router.get("/plans", getPlans);

module.exports = router;
