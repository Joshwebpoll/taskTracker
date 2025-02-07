const mongoose = require("mongoose");
const username = encodeURIComponent("<Josh>");
const password = encodeURIComponent("cnfoyCHV72APHMRn");
const mongoURI =
  "mongodb+srv://joshharyomide:cnfoyCHV72APHMRn@vtuapp.bnghc.mongodb.net/Myvtuapp"; // Replace with your MongoDB URI
const connectToDB = () => {
  return mongoose.connect(mongoURI, {});
};

module.exports = connectToDB;
