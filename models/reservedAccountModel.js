const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  bankCode: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
});
const reservedSchema = mongoose.Schema(
  {
    requestSuccessful: {
      type: String,
      default: null,
    },
    responseMessage: {
      type: String,
      default: null,
    },
    responseCode: {
      type: String,
      default: null,
    },
    contractCode: {
      type: String,
      default: null,
    },
    accountReference: {
      type: String,
      default: null,
    },
    accountName: {
      type: String,
      default: null,
    },
    currencyCode: {
      type: String,
      default: null,
    },
    customerEmail: {
      type: String,
      default: null,
    },
    customerName: {
      type: String,
      default: null,
    },
    accounts: [accountSchema],
    collectionChannel: {
      type: String,
      default: null,
    },
    reservationReference: {
      type: String,
      default: null,
    },
    reservedAccountType: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
    createdOn: {
      type: String,
      default: null,
    },
    bvn: {
      type: String,
      default: null,
    },
    restrictPaymentSource: {
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

const Reserved = mongoose.model("Reserved", reservedSchema);
module.exports = Reserved;
