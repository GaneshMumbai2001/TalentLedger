const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    ipfsHash: { type: String, required: true },
    address: { type: String, unique: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
