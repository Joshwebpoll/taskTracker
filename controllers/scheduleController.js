const { StatusCodes } = require("http-status-codes");
const Schedule = require("../models/scheduleModel");

const createSchedule = async (req, res) => {
  const {
    subject,
    module,
    date,
    building,
    startTime,
    endTime,
    teacher,
    room,
    repeatdays,
    startDate,
    endDate,
  } = req.body;

  try {
    if (
      !subject ||
      !module ||
      !date ||
      !building ||
      !startTime ||
      !endTime ||
      !teacher ||
      !room
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
      });
    }

    const task = new Schedule({
      subject,
      module,
      date,
      building,
      startTime,
      endTime,
      teacher,
      room,
      repeatdays,
      startDate,
      endDate,
      userId: req.user.userid,
    });
    await task.save();
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: true,
      message: "schedule Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSchedule = async (req, res) => {
  try {
    user_id = req.user.userId;
    const getAllTask = await Schedule.find({ user_id });
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
const deleteSchedule = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  console.group(scheduleId);
  const userid = req.user.userid;

  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: scheduleId,
      userId: userid,
    });
    console.log(schedule);
    if (!schedule) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `No id found for ${scheduleId}... Please try again`,
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

const UpdateSchedule = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const userid = req.user.userid;
  console.log(userid);
  try {
    const schedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
        userId: userid,
      },
      req.body,

      {
        new: true,
      }
    );
    if (!schedule) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `No id found for ${scheduleId}... Please try again`,
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
  createSchedule,
  getSchedule,
  deleteSchedule,
  UpdateSchedule,
};
