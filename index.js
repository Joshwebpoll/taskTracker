// require("express-async-errors");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/connect");

const NotFound = require("./middlewares/not-found");
// const errorHandlerMiddleware = require("./middlewares/error-handler");

const userAuthRoute = require("./route/userAuth.js");
const taskRoute = require("./route/taskRoute.js");
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userAuthRoute);
app.use("/api/v1/task", taskRoute);
app.use(NotFound);
// app.use(errorHandlerMiddleware);
const port = 3000;
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
