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

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "All field are require" });
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

    generateJwtCookiesToken(res, user._id);
    sendEmailToNewUsers(email, name, verificationToken);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
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
    user.lastLogin = Date.now();
    await user.save();
    generateJwtCookiesToken(res, user._id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.OK).json({
      success: false,
      message: error.message,
    });
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

    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: true, message: "Email Verified Successful" });
  } catch (error) {
    console.log(error);
    res
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
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid Email Address or Password" });
    }
    const generateResetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = generateResetToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await user.save();

    sendForgotEmailLink(
      user,
      `${process.env.RESET_LINK}/forgotPassword/${generateResetToken}`
    );

    res.status(StatusCodes.BAD_REQUEST).json({
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

const protectedRoute = async (req, res) => {
  try {
    const getUserDetails = await User.findById(req.user.userid).select(
      "-password"
    );
    if (!getUserDetails) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: true, message: "User not found" });
    }
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: true, user: getUserDetails });
  } catch (error) {
    res
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
};
