const mongoose = require("mongoose");

const paymentSourceSchema = new mongoose.Schema({
  bankCode: { type: String, default: null },
  amountPaid: { type: String, default: null },
  accountName: { type: String, default: null },
  sessionId: { type: String, default: null },
  accountNumber: { type: String, default: null },
});
const depositSchema = mongoose.Schema(
  {
    productReference: {
      type: String,
      default: null,
    },
    productType: {
      type: String,
      default: null,
    },
    transactionReference: {
      type: String,
      default: null,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    paidOn: {
      type: String,
      default: null,
    },
    paymentDescription: {
      type: String,
      default: null,
    },
    paymentSourceInformation: [paymentSourceSchema],
    destinationAccountInformationBankCode: {
      type: String,
      default: null,
    },
    destinationAccountInformationAccountNumber: {
      type: String,
      default: null,
    },
    destinationAccountInformationBankName: {
      type: String,
      default: null,
    },
    amountPaid: {
      type: String,
      default: null,
    },
    totalPayable: {
      type: String,
      default: null,
    },
    cardDetailsexpMonth: {
      type: String,
      default: null,
    },
    cardDetailsLast4: {
      type: String,
      default: null,
    },
    cardDetailsmaskedPan: {
      type: String,
      default: null,
    },
    cardDetailsExpYear: {
      type: String,
      default: null,
    },
    cardDetailsBin: {
      type: String,
      default: null,
    },
    cardDetailsReusable: {
      type: Boolean,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: false,
    },
    currency: {
      type: String,
      default: null,
    },
    settlementAmount: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      default: null,
    },
    customerName: {
      type: String,
      default: null,
    },
    customerEmail: {
      type: String,
      default: null,
    },
    eventType: {
      type: String,
      default: null,
    },
    // userid: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
