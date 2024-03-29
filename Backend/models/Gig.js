const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  skillsRequired: { type: [String], required: true },
  didOfPosted: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timeline: { type: String, required: true },

  applicants: [{ type: String }],
  selectedCandidate: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  withdrawal: { type: Boolean, default: false },
  dropped: { type: Boolean, default: false },

  gigPaidToEscrow: { type: Boolean, default: false },
  gigPaidOut: { type: Boolean, default: false },
  tasks: [{ type: String }],
  payments: [{ type: String }],
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
