const express = require("express");
const {
  createExamTask,
  getAllExam,
  deleteExam,
  updateExam,
} = require("../controllers/examsController");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");
router.post("/createexam", protectRoute, createExamTask);
router.get("/getallexam", protectRoute, getAllExam);
router.delete("/deleteexam/:examId", protectRoute, deleteExam);
router.patch("/updateexam/:examId", protectRoute, updateExam);

module.exports = router;
