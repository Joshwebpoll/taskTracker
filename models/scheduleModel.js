const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    repeatdays: {
      type: [String],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

    teacher: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
