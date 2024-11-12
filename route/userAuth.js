const express = require("express");

const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyUserEmail,
  logOutUser,
  resetUserPassword,
  resetUserPasswordLink,
  protectedRoute,
  ResendVerificationEmailToUser,
} = require("../controllers/userAuthController");
const protectRoute = require("../middlewares/protectRoute");

// router.route("/register").post(createProduct).get(getAllProducts);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/emailVerification", verifyUserEmail);
router.post("/logout", logOutUser);
router.post("/forgotPassword", resetUserPassword);
router.post("/resetpassword/:token", resetUserPasswordLink);
router.post("/checkauth", protectRoute, protectedRoute);
router.post("/resendCode", ResendVerificationEmailToUser);

module.exports = router;
