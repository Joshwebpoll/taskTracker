const express = require("express");
const router = express.Router();
const {
  createTask,
  createSubject,
  getAllTask,
  deleteTask,
  UpdateTask,
} = require("../controllers/taskController");
const protectRoute = require("../middlewares/protectRoute");
router.post("/createtasks", protectRoute, createTask);
router.post("/subjects", protectRoute, createSubject);
router.get("/getalltasks", protectRoute, getAllTask);
router.delete("/deletetask/:taskid", protectRoute, deleteTask);
router.patch("/updatetask/:taskid", protectRoute, UpdateTask);

module.exports = router;
