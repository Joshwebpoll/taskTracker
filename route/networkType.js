const express = require("express");
const {
  createNetwork,
  getNetwork,
} = require("../controllers/networkController");

const router = express.Router();

router.post("/network", createNetwork);
router.get("/network", getNetwork);

module.exports = router;
