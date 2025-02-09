const express = require("express");
const {
  createNetwork,
  getNetwork,
} = require("../controllers/networkController");
const { protectedRoute } = require("../controllers/userAuthController");

const router = express.Router();

router.post("/network", protectedRoute, createNetwork);
router.get("/network", protectedRoute, getNetwork);

module.exports = router;
