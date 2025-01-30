const StatusCodes = require("http-status-codes");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const {
  sendEmailToNewUsers,
  sendMailVerificationSuccess,
  sendForgotEmailLink,
  sendResetSuccessEmail,
} = require("../mailtrap/sendEmailsToUser");
const generateJwtCookiesToken = require("../libs/generateJwtTokenCookies");
const UserWallet = require("../models/userWalletModel");
const {
  encryptBalance,
  decryptBalance,
} = require("../libs/walletEncrytDecrypt");
const Reserved = require("../models/reservedAccountModel");
const {
  virtualBankAccount,
} = require("../paymentGateway/monnifyPayment/monnifyPayment");
const { generateReferenceNumber } = require("../libs/generateToken");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All field are required" });
    }
    if (password.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Password Must be greater than 5" });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "User already exist" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // const saltRounds = 10; // Defines the complexity, higher is more secure but slower
    // const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hours
    });
    await user.save();

    const tokens = generateJwtCookiesToken(res, user._id);
    sendEmailToNewUsers(email, name, verificationToken);
    const secureBal = encryptBalance(0);

    const walletBal = new UserWallet({
      userBalance: secureBal.encryptedData,
      userid: user._id,
    });
    await walletBal.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
        token: tokens,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const ResendVerificationEmailToUser = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Field is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Email Address please click the register button below",
      });
    }

    if (user.isverified) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Your Email as Already verified... Please Login",
      });
    }

    sendEmailToNewUsers(user.email, user.name, user.verificationToken);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Verification Code as been sent to your email address",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please all field are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid Email Address or Password" });
    }

    const compareHashPassword = await user.comparePassword(password);

    if (!compareHashPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid Email Address or Password" });
    }

    if (!user.isverified) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email is not verified. Please verify your email first",
      });
    }

    if (user.status === "disabled") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Your account is disabled. Please contact your administrator",
      });
    }
    user.lastLogin = Date.now();
    await user.save();
    const tokens = generateJwtCookiesToken(res, user._id);
    const reservedAcct = await Reserved.findOne({ userid: user._id });
    const refNumber = generateReferenceNumber();
    const cusName = user.name;
    const cusEmail = user.email;
    const bvn = "22227075466";
    const users = await User.findById(user._id).select("-password");

    const getUserWallet = await UserWallet.findOne({
      userid: users._id,
    });
    const walletBalance = decryptBalance(
      getUserWallet.userBalance,
      process.env.IV
    );
    // if (!users) {
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ success: true, message: "User not found" });
    // }
    if (!reservedAcct) {
      const acctDetails = await virtualBankAccount(
        refNumber,
        cusName,
        cusEmail,
        bvn
      );
      const createSubActt = new Reserved({
        requestSuccessful: acctDetails.data.requestSuccessful || null,
        responseMessage: acctDetails.data.responseMessage || null,
        responseCode: acctDetails.data.responseCode || null,
        contractCode: acctDetails.data.responseBody.contractCode || null,
        accountReference:
          acctDetails.data.responseBody.accountReference || null,
        accountName: acctDetails.data.responseBody.accountName || null,
        currencyCode: acctDetails.data.responseBody.currencyCode || null,
        customerEmail: acctDetails.data.responseBody.customerEmail || null,
        customerName: acctDetails.data.responseBody.customerName || null,

        accounts: acctDetails.data.responseBody.accounts || null,
        collectionChannel:
          acctDetails.data.responseBody.collectionChannel || null,
        reservationReference:
          acctDetails.data.responseBody.reservationReference || null,
        reservedAccountType:
          acctDetails.data.responseBody.reservedAccountType || null,
        status: acctDetails.data.responseBody.status || null,
        createdOn: acctDetails.data.responseBody.createdOn || null,
        bvn: acctDetails.data.responseBody.bvn || null,
        restrictPaymentSource:
          acctDetails.data.responseBody.restrictPaymentSource || null,
        userid: user._id,
      });
      await createSubActt.save();
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login Successful",
      email: users.email,
      name: users.name,
      walletBalance,
      token: tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.OK).json({
      success: false,
      message: error.message,
    });
  }
};

const resendEmailVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All field are required" });
    }
    const getCode = await User.findOne({ email: email });
    if (!getCode) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Email Address",
      });
    }
    if (getCode.isverified === true) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email already verified",
      });
    }
    sendEmailToNewUsers(getCode.email, getCode.name, getCode.verificationToken);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Verification code Sent to your Email" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    const checkEmailCode = await User.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!checkEmailCode) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
    checkEmailCode.isverified = true;
    checkEmailCode.verificationToken = undefined;
    checkEmailCode.verificationTokenExpiresAt = undefined;
    await checkEmailCode.save();

    sendMailVerificationSuccess(checkEmailCode.email, checkEmailCode.name);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Email Verified Successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const logOutUser = async (req, res) => {
  res.clearCookie("token");
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged out successfully" });
};

const resetUserPassword = async (req, res) => {
  const { email, platform } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!platform) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "platform is required either for mobile or web",
      });
    }
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Email Address or Password",
      });
    }
    let tokenType;
    const mobilePasswordToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const generateResetToken = crypto.randomBytes(20).toString("hex");
    if (platform === "mobile") {
      tokenType = mobilePasswordToken;
    } else {
      tokenType = generateResetToken;
    }

    user.resetPasswordToken = tokenType;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await user.save();

    sendForgotEmailLink(
      user,
      platform === "mobile"
        ? tokenType
        : `${process.env.RESET_LINK}/forgotPassword/${generateResetToken}`,
      platform
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email verification sent to your email",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
const resetUserPasswordLink = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  if (password.length < 6) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Password Must be greater than 5" });
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    sendResetSuccessEmail(user);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password reset was successful" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const resetUserPasswordOtpMobile = async (req, res) => {
  const { token } = req.body;
  // const { token } = req.params;

  if (token.length === 0 || !token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "In valid token... please try again later",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "valid otp token" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const updatePasswordOtpMobile = async (req, res) => {
  const { password, token } = req.body;
  // const { token } = req.params;
  if (password.length < 6) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: "Password Must be greater than 5" });
  }

  if (token.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "In valid token... please try again later",
    });
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    sendResetSuccessEmail(user);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password reset was successful" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const protectedRoute = async (req, res) => {
  try {
    const users = await User.findById(req.user.userid).select("-password");

    const getUserWallet = await UserWallet.findOne({
      userid: users._id,
    });
    const walletBalance = decryptBalance(
      getUserWallet.userBalance,
      process.env.IV
    );
    if (!users) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: true, message: "User not found" });
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        name: users.name,
        email: users.email,
        walletBalance,
      });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  verifyUserEmail,
  logOutUser,
  resetUserPassword,
  resetUserPasswordLink,
  protectedRoute,
  ResendVerificationEmailToUser,
  resendEmailVerificationCode,
  resetUserPasswordOtpMobile,
  updatePasswordOtpMobile,
};
