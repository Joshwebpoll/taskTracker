const { StatusCodes } = require("http-status-codes");

const createExamTask = (req, res) => {
  console.log(req.body);
  try {
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Something went Wrong" });
  }
};

module.exports = { createExamTask };
