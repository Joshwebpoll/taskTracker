const axios = require("axios");

// const dotenv = require("dotenv");
// dotenv.config();
const createBuydataTransaction = async (productCode, phonNumber) => {
  const api = process.env.BUY_DATA_API;

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
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createBuydataTransaction };
