const mongoose = require("mongoose");

const networkSchema = mongoose.Schema(
  {
    networkName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Network = mongoose.model("Network", networkSchema);
module.exports = Network;
