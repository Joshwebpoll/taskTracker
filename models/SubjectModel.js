const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    subjecName: {
      type: String,
      required: true,
    },

    subjectColor: {
      type: String,
      required: true,
    },
    subjectDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
