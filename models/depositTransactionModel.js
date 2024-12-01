const mongoose = require("mongoose");

// const paymentSourceSchema = new mongoose.Schema({
//   bankCode: { type: String, default: null },
//   amountPaid: { type: String, default: null },
//   accountName: { type: String, default: null },
//   sessionId: { type: String, default: null },
//   accountNumber: { type: String, default: null },
// });
const accountPaymentSchema = new mongoose.Schema({
  accountName: {
    type: String,
    default: null,
  },
  accountNumber: {
    type: String,
    default: null,
  },
  bankCode: {
    type: String,
    default: null,
  },
  amountPaid: {
    type: Number, // Using Number for precise arithmetic operations
    default: null,
    min: 0,
  },
  sessionId: {
    type: String,
    default: null,
  },
  destinationAccountNumber: {
    type: String,
    default: null,
  },
  destinationAccountName: {
    type: String,
    default: null,
  },
  destinationBankCode: {
    type: String,
    default: null,
  },
  destinationBankName: {
    type: String,
    default: null,
  },
  bankName: {
    type: String,
    default: null,
  },
  reservedAccountReference: {
    type: String,
    default: null,
  },
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
    // paymentSourceInformation: [paymentSourceSchema],
    accountPayments: [accountPaymentSchema],
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
    accountName: {
      type: String,
      default: null,
    },
    accountNumber: {
      type: String,
      default: null,
    },
    bankCode: {
      type: String,
      default: null,
    },
    amountPaid: {
      type: Number, // Use Number for arithmetic operations
      default: null,
      min: 0,
    },
    sessionId: {
      type: String,
      default: null,
    },
    destinationAccountNumber: {
      type: String,
      default: null,
    },
    destinationAccountName: {
      type: String,
      default: null,
    },
    destinationBankCode: {
      type: String,
      default: null,
    },
    destinationBankName: {
      type: String,
      default: null,
    },
    bankName: {
      type: String,
      default: null,
    },
    reservedAccountReference: {
      type: String,
      default: null,
    },
    // eventType: {
    //   type: String,
    //   default: null,
    // },
    // userid: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //    default: null,
    // },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
