const mongoose = require("mongoose");

const plansSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    networkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Network",
      required: true,
    },
    networkName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", plansSchema);
module.exports = Plan;
