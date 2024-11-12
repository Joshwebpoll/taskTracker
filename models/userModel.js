const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Define the product schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide user name"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    email: {
      type: String,
      required: [true, "Please provide user description"],
      unique: true,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // bcryptjs hash function
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // bcryptjs compare function
};
// Create a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
