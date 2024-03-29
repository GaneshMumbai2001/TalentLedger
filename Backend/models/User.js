const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    signature: { type: String, required: true, unique: true },
    persona: { type: String, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    did: { type: String, unique: true },
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
