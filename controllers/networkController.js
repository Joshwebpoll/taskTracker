const { StatusCodes } = require("http-status-codes");
const Network = require("../models/networkModel");

const createNetwork = async (req, res) => {
  const { network } = req.body;
  try {
    if (!network) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All field are required" });
    }
    const networks = new Network({
      networkName: network,
    });
    await networks.save();
    res
      .status(StatusCodes.OK)
      .json({ status: true, message: "created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Something went Wrong" });
  }
};
const getNetwork = async (req, res) => {
  try {
    const networks = await Network.find({});
    res.status(StatusCodes.OK).json({ status: true, data: networks });
  } catch (error) {
    res
      .status(StatusCodes.OK)
      .json({ status: true, message: "created successfully" });
  }
};

module.exports = { createNetwork, getNetwork };
