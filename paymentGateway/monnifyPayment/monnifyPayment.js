const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// console.log(generateAuthTokenMonnify());
async function generateAuthTokenMonnify() {
  const apiKey = process.env.MONNIFY_API;
  const secretKey = process.env.MONNIFY_SECRETKEY;

  // Encode the credentials as Base64
  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64"); // Use Buffer for compatibility
  try {
    const options = {
      method: "POST",
      url: "https://api.monnify.com/api/v1/auth/login",
      headers: {
        accept: "application/json",
        Authorization: `Basic ${credentials}`,
        "content-type": "application/json",
      },
    };

    const response = await axios.request(options);

    return response.data.responseBody.accessToken;
  } catch (error) {
    console.error(error);
  }
}

async function monnifyInitializaTransaction(
  amountToPay,
  customerNames,
  customerEmails,
  paymentRef,
  paymentDec
) {
  try {
    data = {
      amount: amountToPay,
      customerName: customerNames,
      customerEmail: customerEmails,
      paymentReference: paymentRef,
      paymentDescription: paymentDec,
      currencyCode: "NGN",
      contractCode: process.env.MONNIFY_CONTRACT_CODE,
      redirectUrl: "https://my-merchants-page.com/transaction/confirm",
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
    };

    let accessTokens = await generateAuthTokenMonnify();
    const options = {
      method: "POST",
      url: "https://api.monnify.com/api/v1/merchant/transactions/init-transaction",
      headers: {
        // accept: "application/json",

        "content-type": "application/json",
        Authorization: `Bearer ${accessTokens}`,
      },
      data,
    };

    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// virtualBankAccount(
//   "939884738735",
//   "Bowofola Joshman",
//   "josh@gmail.com",
//   "22227075466"
// );
async function virtualBankAccount(acctRef, cusName, cusEmail, cusBvn) {
  try {
    data = {
      accountReference: acctRef,
      accountName: cusName,
      currencyCode: "NGN",
      contractCode: process.env.MONNIFY_CONTRACT_CODE,
      customerEmail: cusEmail,
      bvn: cusBvn,
      customerName: cusName,
      getAllAvailableBanks: true,
    };

    let accessTokens = await generateAuthTokenMonnify();
    const options = {
      method: "POST",
      url: "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts",
      headers: {
        // accept: "application/json",

        "content-type": "application/json",
        Authorization: `Bearer ${accessTokens}`,
      },
      data,
    };

    const response = await axios.request(options);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function verifyPayment(referenceNo) {
  let ref = encodeURIComponent(referenceNo);
  try {
    let accessTokens = await generateAuthTokenMonnify(referenceNo);
    const options = {
      method: "GET",
      url: `https://api.monnify.com/api/v2/transactions/${ref}`,
      headers: {
        // accept: "application/json",

        "content-type": "application/json",
        Authorization: `Bearer ${accessTokens}`,
      },
    };

    const response = await axios.request(options);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
//verifyPayment("MNFY|81|20241129111438|010472");

module.exports = {
  monnifyInitializaTransaction,
  virtualBankAccount,
  verifyPayment,
};
