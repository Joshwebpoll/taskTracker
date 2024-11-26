const { StatusCodes } = require("http-status-codes");
const Exam = require("../models/examModel");
const Subject = require("../models/SubjectModel");

const createExamTask = async (req, res) => {
  const { subject, module, dueDate, resit, startTime, duration, seat, room } =
    req.body;

  console.log(req.user);
  try {
    if (
      !subject ||
      !module ||
      !dueDate ||
      !startTime ||
      !duration ||
      !seat ||
      !room
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exam = new Exam({
      subject,
      module,
      resit,
      dueDate,
      startTime,
      duration,
      seat,
      room,
      userId: req.user.userid,
    });
    await exam.save();
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "success",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went Wrong" });
  }
};

const getAllExam = async (req, res) => {
  const userid = req.user.userId;
  try {
    const exam = await Exam.find({ userid });
    if (!exam) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Something went Wrong" });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: false, message: "Success", exam });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went Wrong" });
  }
};

const deleteExam = async (req, res) => {
  const { examId } = req.params;
  console.log(examId);
  const userid = req.user.userid;
  console.log(userid);
  try {
    const exam = await Exam.findOneAndDelete({
      userId: userid,
      _id: examId,
    });
    if (!exam) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: `Invalid ${examId}` });
    }

    res.status(StatusCodes.OK).json({
      success: false,
      message: `${examId} as been deleted Successfully`,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went Wrong" });
  }
};

const updateExam = async (req, res) => {
  const { examId } = req.params;

  const userid = req.user.userid;

  try {
    const exam = await Exam.findOneAndUpdate(
      { userId: userid, _id: examId },
      req.body,
      {
        new: true,
      }
    );
    if (!exam) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: `Invalid ${examId}` });
    }
    res.status(StatusCodes.OK).json({
      success: false,
      message: `${examId} as been updated Successfully`,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went Wrong" });
  }
};

module.exports = { createExamTask, getAllExam, deleteExam, updateExam };
