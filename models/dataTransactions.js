const mongoose = require("mongoose");

const dataTransactionSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      default: null,
    },
    productCode: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "completed"],
      default: "pending",
    },
    networkName: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    referenceNumber: {
      type: String,
      default: null,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const DataTransaction = mongoose.model(
  "DataTransaction",
  dataTransactionSchema
);
module.exports = DataTransaction;
