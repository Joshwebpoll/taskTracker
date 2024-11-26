const express = require("express");

const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");
const {
  getSchedule,
  createSchedule,
  deleteSchedule,
  UpdateSchedule,
} = require("../controllers/scheduleController");
router.post("/createschedule", protectRoute, createSchedule);
router.get("/getallschedule", protectRoute, getSchedule);
router.delete("/deleteschedule/:scheduleId", protectRoute, deleteSchedule);
router.patch("/updateschedule/:scheduleId", protectRoute, UpdateSchedule);

module.exports = router;
