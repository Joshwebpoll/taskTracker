const express = require("express");
const { createExamTask } = require("../controllers/examsController");
const router = express.Router();

router.post("/createexam", createExamTask);

module.exports = router;
