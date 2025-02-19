const { StatusCodes } = require("http-status-codes");
const Plan = require("../models/networkplansModel");

const createPlans = async (req, res) => {
  const { planName, productCode, price, networkId, networkName } = req.body;
  try {
    if (!planName || !productCode || !price || !networkId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All field are required" });
    }
    const plansDuplicate = await Plan.findOne({ planName });

    if (plansDuplicate) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "This plan Already exist" });
    }

    const plans = new Plan({
      planName,
      productCode,
      price,
      networkId,
      networkName,
    });

    await plans.save();
    return res
      .status(StatusCodes.OK)
      .json({ status: true, message: "Plan Added successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Something Went Wrong" });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.status(StatusCodes.OK).json({ status: true, data: plans });
  } catch (error) {
    res
      .status(StatusCodes.OK)
      .json({ status: true, message: "created successfully" });
  }
};

const getPlansByNetwork = async (req, res) => {
  const plansNetwork = req.query.network;

  try {
    if (!plansNetwork) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Query value must not be empty",
      });
    }
    const plans = await Plan.find({ networkName: plansNetwork });

    if (!plans) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Invalid network query, Please try again",
      });
    }
    return res.status(StatusCodes.OK).json({ status: true, data: plans });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Something went wrong" });
  }
};

module.exports = { createPlans, getPlans, getPlansByNetwork };
