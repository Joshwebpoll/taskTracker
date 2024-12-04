const { StatusCodes } = require("http-status-codes");
const {
  createBuydataTransaction,
  checkDataStatus,
} = require("../apiRequest/buyDataApi");
const {
  validateNigerianPhoneNumber,
} = require("../libs/validateNigeriaPhoneNumber");
const Plan = require("../models/networkplansModel");
const DataTransaction = require("../models/dataTransactions");
const { generateReferenceNumberData } = require("../libs/generateToken");
const UserWallet = require("../models/userWalletModel");
const {
  decryptBalance,
  encryptBalance,
} = require("../libs/walletEncrytDecrypt");
const DataTransactionVerify = require("../models/dataResultTransaction");

const createTransaction = async (req, res) => {
  const { productCode, phoneNumber } = req.body;

  // if (!validateNigerianPhoneNumber(phoneNumber)) {
  //   return res.status(StatusCodes.BAD_GATEWAY).json({
  //     status: false,
  //     message: "Invalid phone number",
  //   });
  // }
  if (!phoneNumber) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      status: false,
      message: "Please enter a valid phone number",
    });
  }
  if (isNaN(phoneNumber)) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      status: false,
      message: "Please enter a valid phone number",
    });
  }
  if (phoneNumber.length < 11) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      status: false,
      message: `${phoneNumber} must be 11`,
    });
  }
  try {
    const userid = req.user.userid;
    const getPlans = await Plan.findOne({ productCode: productCode }).populate(
      "networkId",
      "networkName"
    );
    if (!getPlans) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status: false,
        message: "Invalid request Please try again later.",
      });
    }
    const dataTransactionSaved = new DataTransaction({
      planName: getPlans.planName,
      productCode: getPlans.productCode,
      price: getPlans.price,
      phoneNumber: phoneNumber,
      networkName: getPlans.networkId.networkName,
      referenceNumber: generateReferenceNumberData(),
      userid: userid,
    });
    const savedTransact = await dataTransactionSaved.save();
    // console.log(savedTransact);
    const getUserWallet = await UserWallet.findOne({ userid: userid });
    // console.log(getUserWallet);
    const decrytBal = decryptBalance(getUserWallet.userBalance, process.env.IV);
    // console.log(decrytBal);

    if (Number(decrytBal) < Number(dataTransactionSaved.price)) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status: false,
        message: "Low balance, Please add fund to your wallet",
      });
    }
    const newBalance = Number(decrytBal) - Number(dataTransactionSaved.price);
    // console.log(newBalance);
    const balanceEncrypted = encryptBalance(newBalance);
    getUserWallet.userBalance = balanceEncrypted.encryptedData;
    await getUserWallet.save();
    const result = await createBuydataTransaction(productCode, phoneNumber);
    // console.log(result);
    // console.log(result.data.data.recharge_id);
    const getDataStatus = await checkDataStatus(result.data.data.recharge_id);
    // console.log(getDataStatus);
    if (
      getDataStatus.data.server_message === "Transaction Successful" &&
      getDataStatus.data.status === true
    ) {
      const saveDataStatusTransaction = new DataTransactionVerify({
        server_message: getDataStatus.data.server_message,
        status: getDataStatus.data.status,
        error_code: getDataStatus.data.error_code,
        recharge_id: getDataStatus.data.data.recharge_id,
        amount_charged: getDataStatus.data.data.amount_charged,
        after_balance: getDataStatus.data.data.after_balance,
        bonus_earned: getDataStatus.data.data.bonus_earned,
        status: getDataStatus.data.data.status,
        data_result: getDataStatus.data.data_result,
        text_status: getDataStatus.data.text_status,
        error: getDataStatus.data.error,
        userid: userid,
      });
      await saveDataStatusTransaction.save();
      savedTransact.status = "completed";
      const purchase = await savedTransact.save();
      console.log(purchase);
      if (purchase.status === "completed") {
        return res.status(StatusCodes.OK).json({
          status: true,
          message: `Your purchase of ${savedTransact.planName} for ${savedTransact.phoneNumber} was successful`,
        });
      }
    } else {
      savedTransact.status = "failed";
      await savedTransact.save();
      return res.status(StatusCodes.OK).json({
        status: false,
        message: "failed",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.OK).json({
      status: false,
      message: "Something went wrong",
    });
    console.error(error);
  }
};

module.exports = { createTransaction };
