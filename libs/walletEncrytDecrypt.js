const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// Define encryption key and initialization vector
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32 bytes key for AES-256
const IV = Buffer.from(process.env.IV, "hex"); // 16 bytes IV
// const ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
// const IV = crypto.randomBytes(16).toString("hex");
// console.log(ENCRYPTION_KEY, "Encryption");
// console.log(IV, "IVME");
// Encryption function
function encryptBalance(balance) {
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(balance.toString(), "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: IV.toString("hex") };
}

// Decryption function
function decryptBalance(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
//console.log(encryptBalance(100000));
// console.log(
//   decryptBalance(
//     "0902ee0620cc83e866ced98d54f036b0",
//     "257e7ab83dd4de3012359388e0f6039e"
//   )
// );
module.exports = { encryptBalance, decryptBalance };
