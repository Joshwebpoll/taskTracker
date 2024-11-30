const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");

const { generateReferenceNumber } = require("../libs/generateToken");
const User = require("../models/userModel");
const {
  monnifyInitializaTransaction,
} = require("../paymentGateway/monnifyPayment/monnifyPayment");
const Deposit = require("../models/depositTransactionModel");
const dotenv = require("dotenv");
const Duplicate = require("../models/duplicateModel");
const Transaction = require("../models/initializeTransaction");
const UserWallet = require("../models/userWalletModel");
const {
  decryptBalance,
  encryptBalance,
} = require("../libs/walletEncrytDecrypt");
dotenv.config();
const initailPaymentToWallet = async (req, res) => {
  const { amountToPay } = req.body;
  console.log(amountToPay);

  if (!amountToPay) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Please Enter a valid amount" });
  }
  if (amountToPay <= 10) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Deposit amount should be greater than 100 naira",
    });
  }

  if (/[^0-9.]/.test(amountToPay)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Deposit amount contains invalid characters",
    });
  }
  if (isNaN(amountToPay)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Deposit amount must be a number",
    });
  }
  try {
    const userid = req.user.userid;

    const getDetails = await User.findById({ _id: userid });
    console.log(getDetails);
    const userName = getDetails.name;
    const userEmail = getDetails.email;
    console.log(userEmail);
    const refNumber = generateReferenceNumber();
    const deposit = await monnifyInitializaTransaction(
      amountToPay,
      userName,
      userEmail,
      refNumber,
      "custmomer Payment"
    );
    console.log(deposit.data.responseBody.enabledPaymentMethod);
    if (
      deposit.data.requestSuccessful === true &&
      deposit.data.responseMessage === "success"
    ) {
      const initTransact = new Transaction({
        requestSuccessful: deposit.data.requestSuccessful,
        responseMessage: deposit.data.responseMessage,
        responseCode: deposit.data.responseCode,
        responseBody: deposit.data.responseBody,
        userid: userid,
      });
      await initTransact.save();
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: true,
        data: deposit.data.responseBody,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const getWebHookInformations = async (req, res) => {
  const paymentInfo = req.body;
  const headers = req.headers;
  const monnifySignature = headers["monnify-signature"];
  // console.log(paymentInfo);
  const computeHash = (requestBody) => {
    const secretKey = process.env.MONNIFY_SECRETKEY;
    const requestBodyString = JSON.stringify(requestBody); // Convert object to string
    const hmac = crypto.createHmac("sha512", secretKey);
    hmac.update(requestBodyString); // Use the string version of requestBody
    const result = hmac.digest("hex"); // or 'base64' depending on your need
    return result;
  };

  const computedHash = computeHash(paymentInfo);
  // console.log("Computed hash", computedHash);

  try {
    const checkForDuplicate = await Deposit.findOne({
      transactionReference: paymentInfo.eventData.transactionReference,
    });
    if (!checkForDuplicate) {
      if (computedHash === monnifySignature) {
        const savePayment = new Deposit({
          productReference: paymentInfo.eventData.product.reference || null,
          productType: paymentInfo.eventData.product.type || null,
          transactionReference:
            paymentInfo.eventData.transactionReference || null,
          paymentReference: paymentInfo.eventData.paymentReference || null,
          paidOn: paymentInfo.eventData.paidOn || null,
          paymentDescription: paymentInfo.eventData.paymentDescription || null,
          paymentSourceInformation:
            paymentInfo.eventData.paymentSourceInformation || null,
          destinationAccountInformationBankCode:
            paymentInfo.eventData.destinationAccountInformation.bankCode ||
            null,
          destinationAccountInformationAccountNumber:
            paymentInfo.eventData.destinationAccountInformation.accountNumber ||
            null,
          destinationAccountInformationBankName:
            paymentInfo.eventData.destinationAccountInformation.bankName ||
            null,
          amountPaid: paymentInfo.eventData.amountPaid || null,
          totalPayable: paymentInfo.eventData.totalPayable || null,
          cardDetailsexpMonth:
            paymentInfo.eventData.cardDetails.expMonth || null,
          cardDetailsLast4: paymentInfo.eventData.cardDetails.last4 || null,
          cardDetailsmaskedPan:
            paymentInfo.eventData.cardDetails.maskedPan || null,
          cardDetailsExpYear: paymentInfo.eventData.cardDetails.expYear || null,
          cardDetailsBin: paymentInfo.eventData.cardDetails.bin || null,
          cardDetailsReusable:
            paymentInfo.eventData.cardDetails.reusable || null,
          paymentMethod: paymentInfo.eventData.paymentMethod || null,
          currency: paymentInfo.eventData.currency || null,
          settlementAmount: paymentInfo.eventData.settlementAmount || null,
          paymentStatus: paymentInfo.eventData.paymentStatus || null,
          customerName: paymentInfo.eventData.customer.name || null,
          customerEmail: paymentInfo.eventData.customer.email || null,
          eventType: paymentInfo.eventType || null,
        });
        await savePayment.save();
        if (paymentInfo.eventData.product.type === "WEB_SDK") {
          const userWhoMadePayment = await Transaction.findOne({
            "responseBody.transactionReference":
              paymentInfo.eventData.transactionReference,
            "responseBody.paymentReference":
              paymentInfo.eventData.paymentReference,
          })
            .populate("userid", "email _id")
            .exec();

          const useCallbackDeposit = await Deposit.findOne({
            transactionReference:
              userWhoMadePayment.responseBody.transactionReference,
            paymentReference: userWhoMadePayment.responseBody.paymentReference,
          });
          // console.log(userWhoMadePayment);
          // console.log(userWhoMadePayment);
          // console.log(useCallbackDeposit);
          if (
            userWhoMadePayment.responseBody.transactionReference ===
              useCallbackDeposit.transactionReference &&
            userWhoMadePayment.responseBody.paymentReference ===
              useCallbackDeposit.productReference
          ) {
            const userid = userWhoMadePayment.userid._id.valueOf();
            const addToWallet = await UserWallet.findOne({
              userid: userWhoMadePayment.userid._id,
            });
            console.log(addToWallet);
            const deCryptAmount = decryptBalance(
              addToWallet.userBalance,
              process.env.IV
            );
            // console.log(deCryptAmount);
            // console.log(useCallbackDeposit.amountPaid);
            const newAmount =
              Number(deCryptAmount) + Number(useCallbackDeposit.amountPaid);
            const amountString = newAmount;
            const balanceEncrypted = encryptBalance(amountString);
            addToWallet.userBalance = balanceEncrypted.encryptedData;
            await addToWallet.save();
          }
        }
        if (paymentInfo.eventData.product.type === "RESERVED_ACCOUNT") {
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { initailPaymentToWallet, getWebHookInformations };
