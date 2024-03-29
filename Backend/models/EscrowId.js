const mongoose = require("mongoose");

const uniqueCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  currentValue: { type: Number, default: 0 },
});
uniqueCounterSchema.pre("save", async function (next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("UniqueCounter", uniqueCounterSchema);
