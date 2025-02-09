const express = require("express");
const {
  createNetwork,
  getNetwork,
} = require("../controllers/networkController");
const { protectedRoute } = require("../controllers/userAuthController");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/network", protectRoute, createNetwork);
router.get("/network", protectRoute, getNetwork);

module.exports = router;
