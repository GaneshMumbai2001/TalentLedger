const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: { type: String, required: true, unique: true },
    twitter: { type: String, required: true },

    discord: { type: String, required: true },
  },
  { timestamps: true }
);

providerSchema.pre("save", async function (next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
});

const Provider = mongoose.model("Provider", providerSchema);

module.exports = Provider;
