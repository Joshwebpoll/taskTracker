// require("express-async-errors");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/connect");
var cors = require("cors");

const NotFound = require("./middlewares/not-found");
// const errorHandlerMiddleware = require("./middlewares/error-handler");

const userAuthRoute = require("./route/userAuth.js");
const networkRoute = require("./route/networkType.js");
const plansRoute = require("./route/networkplans");
const buydataRoute = require("./route/buyDataPlan.js");
const addPaymentRoute = require("./route/addPaymentToWalletRoute.js");

dotenv.config();
// app.use(
//   cors({
//     origin: "http://192.168.123.59", // Your front-end origin
//     credentials: true,
//   })
// );

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userAuthRoute);
app.use("/api/v1/vtu", networkRoute);
app.use("/api/v1/vtu", plansRoute);
app.use("/api/v1/vtu", buydataRoute);
app.use("/api/v1/payment", addPaymentRoute);

app.use(NotFound);
// app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectToDB();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
