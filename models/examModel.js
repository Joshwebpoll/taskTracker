const mongoose = require("mongoose");

const examSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    resit: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    seat: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
