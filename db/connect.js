const mongoose = require("mongoose");
const username = encodeURIComponent("<Josh>");
const password = encodeURIComponent("Bowofola");
const mongoURI = `mongodb+srv://Josh:${password}@student.25boz.mongodb.net/StudentStudyLife`; // Replace with your MongoDB URI
const connectToDB = () => {
  return mongoose.connect(mongoURI, {});
};

module.exports = connectToDB;
