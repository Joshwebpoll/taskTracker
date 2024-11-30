const mongoose = require("mongoose");

const userWalletSchema = mongoose.Schema(
  {
    userBalance: {
      type: String,
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const UserWallet = mongoose.model("UserWallet", userWalletSchema);
module.exports = UserWallet;
