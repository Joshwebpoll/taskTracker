const mongoose = require("mongoose");

const dataTransactionVerifySchema = new mongoose.Schema(
  {
    server_message: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    error_code: {
      type: Number,
      required: false, // Not mandatory, as not all transactions might have this
    },

    recharge_id: {
      type: Number,
      default: null,
    },
    amount_charged: {
      type: String,
      default: null,
    },
    after_balance: {
      type: String,
      default: null,
    },
    bonus_earned: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      // enum: ["COMPLETED", "FAILED", "PENDING"], // Restricting possible values
      default: null,
    },

    data_result: {
      type: Array,
      default: [], // Defaults to an empty array
    },
    error_data: {
      type: Array,
      default: [], // Defaults to an empty array
    },
    text_status: {
      type: String,
      //   enum: ["COMPLETED", "FAILED", "PENDING"], // Restricting possible values
      default: null,
    },
    error: {
      type: String, // Can accept any data type (e.g., null, string, object)
      default: null,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const DataTransactionVerify = mongoose.model(
  "DataTransactionVerify",
  dataTransactionVerifySchema
);

module.exports = DataTransactionVerify;
