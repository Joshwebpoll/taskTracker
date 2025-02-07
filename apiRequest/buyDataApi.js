const axios = require("axios");
const {
  validateNigerianPhoneNumber,
} = require("../libs/validateNigeriaPhoneNumber");
const { StatusCodes } = require("http-status-codes");

// const dotenv = require("dotenv");
// dotenv.config();
const createBuydataTransaction = async (productCode, phonNumber) => {
  const api = process.env.BUY_DATA_API;
  //  if (validateNigerianPhoneNumber(phonNumber)){
  //   res.status(StatusCodes.BAD_GATEWAY).json({
  //     status:false,
  //     message:"Invalid phone number"
  //   })
  //  }
  try {
    const options = {
      method: "POST",
      url: `https://cheapdatasales.com/api/v2/datashare/?api_key=${api}&product_code=${productCode}&phone=${phonNumber}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    };

    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const checkDataStatus = async (recharge_id) => {
  const api = process.env.BUY_DATA_API;

  try {
    const options = {
      method: "POST",
      url: `https://cheapdatasales.com/api/v2/datashare/?api_key=${api}&order_id=${recharge_id}&task=check_status`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    };

    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};
// checkDataStatus("13775504");
module.exports = { createBuydataTransaction, checkDataStatus };
