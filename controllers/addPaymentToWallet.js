const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");

const { generateReferenceNumber } = require("../libs/generateToken");
const User = require("../models/userModel");
const {
  monnifyInitializaTransaction,
  verifyPayment,
} = require("../paymentGateway/monnifyPayment/monnifyPayment");
const Deposit = require("../models/depositTransactionModel");
const dotenv = require("dotenv");
const Duplicate = require("../models/duplicateModel");
const Transaction = require("../models/initializeTransaction");
const UserWallet = require("../models/userWalletModel");
const jwt = require("jsonwebtoken");
const {
  decryptBalance,
  encryptBalance,
} = require("../libs/walletEncrytDecrypt");
const Reserved = require("../models/reservedAccountModel");
dotenv.config();
const initailPaymentToWallet = async (req, res) => {
  const { amountToPay } = req.body;
  // console.log(amountToPay);

  if (!amountToPay) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Please Enter a valid amount" });
  }
  if (amountToPay <= 100) {
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

    const userName = getDetails.name;
    const userEmail = getDetails.email;

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
      return res.status(StatusCodes.OK).json({
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
  const paymentInfo = req.body; //Get Payment Information from webhook
  const headers = req.headers; //Get Headers from webhook
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

  try {
    const checkForDuplicate = await Deposit.findOne({
      transactionReference: paymentInfo.eventData.transactionReference,
    });
    if (!checkForDuplicate) {
      if (computedHash === monnifySignature) {
        //Verify Payment
        const transactionStatusVerify = await verifyPayment(
          paymentInfo.eventData.transactionReference
        );

        if (
          transactionStatusVerify.data.requestSuccessful === true &&
          transactionStatusVerify.data.responseMessage === "success"
        ) {
          const savePayment = new Deposit({
            productReference:
              transactionStatusVerify.data.responseBody.product.reference ||
              null,
            productType:
              transactionStatusVerify.data.responseBody.product.type || null,
            transactionReference:
              transactionStatusVerify.data.responseBody.transactionReference ||
              null,
            paymentReference:
              transactionStatusVerify.data.responseBody.paymentReference ||
              null,
            paidOn: transactionStatusVerify.data.responseBody.paidOn || null,
            paymentDescription:
              transactionStatusVerify.data.responseBody.paymentDescription ||
              null,
            paymentSourceInformation:
              paymentInfo.eventData.paymentSourceInformation || null,
            accountPayments: transactionStatusVerify.data.responseBody
              .accountPayments
              ? transactionStatusVerify.data.responseBody.accountPayments
              : [],
            amountPaid:
              transactionStatusVerify.data.responseBody.amountPaid || null,
            totalPayable:
              transactionStatusVerify.data.responseBody.totalPayable || null,
            cardDetailsexpMonth: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.expMonth
              : null,
            cardDetailsLast4: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.last4
              : null,
            cardDetailsmaskedPan: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.maskedPan
              : null,
            cardDetailsExpYear: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.expYear
              : null,
            cardDetailsBin: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.bin
              : null,
            cardDetailsReusable: transactionStatusVerify.data.responseBody
              .cardDetails
              ? transactionStatusVerify.data.responseBody.cardDetails.reusable
              : null,
            paymentMethod:
              transactionStatusVerify.data.responseBody.paymentMethod || null,
            currency:
              transactionStatusVerify.data.responseBody.currency || null,
            settlementAmount:
              transactionStatusVerify.data.responseBody.settlementAmount ||
              null,
            paymentStatus:
              transactionStatusVerify.data.responseBody.paymentStatus || null,
            customerName:
              transactionStatusVerify.data.responseBody.name || null,
            customerEmail:
              transactionStatusVerify.data.responseBody.customer.email || null,
            accountName: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .accountName
              : null,
            accountNumber: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .accountNumber
              : null,
            bankCode: transactionStatusVerify.data.responseBody.accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .bankCode
              : null,
            amountPaid: transactionStatusVerify.data.responseBody.accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .amountPaid
              : null,
            sessionId: transactionStatusVerify.data.responseBody.accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .sessionId
              : null,
            destinationAccountNumber: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .destinationAccountNumber
              : null,
            destinationAccountName: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .destinationAccountName
              : null,
            destinationBankCode: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .destinationBankCode
              : null,
            destinationBankName: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .destinationBankName
              : null,
            bankName: transactionStatusVerify.data.responseBody.accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .bankName
              : null,
            reservedAccountReference: transactionStatusVerify.data.responseBody
              .accountDetails
              ? transactionStatusVerify.data.responseBody.accountDetails
                  .reservedAccountReference
              : null,
            mobileUserId: transactionStatusVerify.data.responseBody.metaData
              ? transactionStatusVerify.data.responseBody.metaData.userId
              : null,
            // eventType: paymentInfo.eventType || null,
          });
          await savePayment.save();
          if (
            transactionStatusVerify.data.responseBody.product.type === "WEB_SDK"
          ) {
            console.log(transactionStatusVerify);
            const userWhoMadePayment = await Transaction.findOne({
              "responseBody.transactionReference":
                transactionStatusVerify.data.responseBody.transactionReference,
              "responseBody.paymentReference":
                transactionStatusVerify.data.responseBody.paymentReference,
            })
              .populate("userid", "email _id")
              .exec();

            const useCallbackDeposit = await Deposit.findOne({
              transactionReference:
                userWhoMadePayment.responseBody.transactionReference,
              paymentReference:
                userWhoMadePayment.responseBody.paymentReference,
            });

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

              const deCryptAmount = decryptBalance(
                addToWallet.userBalance,
                process.env.IV
              );
              console.log(deCryptAmount);
              const newAmount =
                Number(deCryptAmount) + Number(useCallbackDeposit.amountPaid);
              const amountString = newAmount;
              const balanceEncrypted = encryptBalance(amountString);
              addToWallet.userBalance = balanceEncrypted.encryptedData;
              await addToWallet.save();
            }
          }
          if (
            transactionStatusVerify.data.responseBody.product.type ===
            "RESERVED_ACCOUNT"
          ) {
            const useCallbackDeposits = await Deposit.findOne({
              transactionReference:
                transactionStatusVerify.data.responseBody.transactionReference,
              paymentReference:
                transactionStatusVerify.data.responseBody.paymentReference,
            });
            console.log(useCallbackDeposits);
            const userReservedAcct =
              useCallbackDeposits.destinationAccountNumber;
            console.log(userReservedAcct);
            const getReservedAccount = await Reserved.findOne({
              "accounts.accountNumber": userReservedAcct,
            })
              .populate("userid", "email")
              .exec();
            // console.log(getReservedAccount);
            const getUserWallet = await UserWallet.findOne({
              userid: getReservedAccount.userid._id,
            });
            console.log(getUserWallet);

            const deCryptAmountReserved = decryptBalance(
              getUserWallet.userBalance,
              process.env.IV
            );

            const newAmountReserved =
              Number(deCryptAmountReserved) +
              Number(useCallbackDeposits.amountPaid);
            const amountStringReserved = newAmountReserved;
            console.log(amountStringReserved);
            const balanceEncryptedReserved =
              encryptBalance(amountStringReserved);
            getUserWallet.userBalance = balanceEncryptedReserved.encryptedData;
            await getUserWallet.save();
          }

          if (
            transactionStatusVerify.data.responseBody.product.type ===
            "MOBILE_SDK"
          ) {
            const useCallbackDeposits = await Deposit.findOne({
              transactionReference:
                transactionStatusVerify.data.responseBody.transactionReference,
              paymentReference:
                transactionStatusVerify.data.responseBody.paymentReference,
            });

            const getMobileUser = jwt.verify(
              useCallbackDeposits.mobileUserId,
              process.env.JWT_SECRET_KEY
            );
            const realUserId = getMobileUser.userid;

            const addToWallet = await UserWallet.findOne({
              userid: realUserId,
            });

            const deCryptAmount = decryptBalance(
              addToWallet.userBalance,
              process.env.IV
            );
            console.log(deCryptAmount);
            const useCallbackDep = await Deposit.findOne({
              transactionReference:
                transactionStatusVerify.data.responseBody.transactionReference,
              paymentReference:
                transactionStatusVerify.data.responseBody.paymentReference,
            });

            const newAmount =
              Number(deCryptAmount) + Number(useCallbackDep.amountPaid);
            const amountString = newAmount;
            const balanceEncrypted = encryptBalance(amountString);
            addToWallet.userBalance = balanceEncrypted.encryptedData;
            await addToWallet.save();
          }
        }
      } //lastone
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { initailPaymentToWallet, getWebHookInformations };
