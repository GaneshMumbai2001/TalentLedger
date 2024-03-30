const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  skillsRequired: { type: [String], required: true },
  providerAddress: { type: String, required: true },
  createdBy: {
    type: String,
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
  escrowId: { type: Number, required: true },
  tasks: [
    {
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
      payment: {
        amount: { type: Number, required: true },
        paymentStatus: { type: Boolean, default: false },
        paymentDetails: { type: String },
      },
    },
  ],
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
