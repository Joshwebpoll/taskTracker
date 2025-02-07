const mongoose = require("mongoose");

const duplicateSchema = mongoose.Schema(
  {
    transactionReference: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Duplicate = mongoose.model("Duplicate", duplicateSchema);
module.exports = Duplicate;
