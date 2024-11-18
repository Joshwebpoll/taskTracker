const { StatusCodes } = require("http-status-codes");
const Subject = require("../models/SubjectModel");
const Task = require("../models/TaskModel");

const createSubject = async (req, res) => {
  const { subject } = req.body;
  try {
    if (!subject) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Field is required",
      });
    }

    const subjects = await Subject.findOne({ subjecName: subject });

    if (subjects) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Duplicate Entries.. ${subject} already Exist`,
      });
    }

    const newSubject = new Subject({
      subjecName: subject,
      subjectDate: new Date(),
    });
    await newSubject.save();

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createTask = async (req, res) => {
  const { subject, taskType, taskTitle, taskDetail, dueDate } = req.body;
  console.log(req.user);
  try {
    if (!subject || !taskType || !taskTitle || !taskDetail || !dueDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
      });
    }

    const task = new Task({
      subject,
      taskType,
      taskTitle,
      taskDetail,
      dueDate,
      userId: req.user.userid,
    });
    await task.save();
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "Task Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllTask = async (req, res) => {
  try {
    user_id = req.user.userId;
    const getAllTask = await Task.find({ user_id });
    if (getAllTask.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No Task found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Success",
      data: getAllTask,
      length: getAllTask.length,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const deleteTask = async (req, res) => {
  const taskId = req.params.taskid;
  userid = req.user.userId;
  try {
    const task = await Task.findByIdAndDelete({ _id: taskId, userId: userid });
    if (!task) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `No id found for ${taskId}... Please try again`,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "Task deleted successfully...",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong or invalid id provided",
    });
  }
};

const UpdateTask = async (req, res) => {
  const taskId = req.params.taskid;
  userid = req.user.userId;
  try {
    const task = await Task.findByIdAndUpdate(
      {
        _id: taskId,
        userId: userid,
      },
      req.body,

      {
        new: true,
      }
    );
    if (!task) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `No id found for ${taskId}... Please try again`,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "Task Updated successfully...",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong or invalid id provided",
    });
  }
};
module.exports = {
  createTask,
  createSubject,
  getAllTask,
  deleteTask,
  UpdateTask,
};
