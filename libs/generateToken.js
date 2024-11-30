const crypto = require("crypto");

const generateReferenceNumber = () => {
  return "VTU-" + crypto.randomBytes(10).toString("hex").toUpperCase();
};
module.exports = { generateReferenceNumber };
