const mongoose = require("mongoose");

// Define the schema for the response body
const responseBodySchema = new mongoose.Schema({
  transactionReference: {
    type: String,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
  },
  merchantName: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  enabledPaymentMethod: [
    {
      type: String,
    },
  ],
  redirectUrl: {
    type: String,
    required: true,
  },

  checkoutUrl: {
    type: String,
    required: true,
  },
});

// Define the schema for the transaction data
const transactionSchema = new mongoose.Schema(
  {
    requestSuccessful: {
      type: Boolean,
      required: true,
    },
    responseMessage: {
      type: String,
      required: true,
    },
    responseCode: {
      type: String,
      required: true,
    },
    responseBody: {
      type: responseBodySchema,
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

// Create a model based on the schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
