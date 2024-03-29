const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  skillsRequired: { type: [String], required: true },
  didOfPosted: { type: String, required: true },
  providerAddress: { type: String, required: true },
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
  escrowId: { type: Number, required: true },

  // Updated part of the schema for tasks and payments
  tasks: [
    {
      description: { type: String, required: true },
      completed: { type: Boolean, default: false }, // Indicates if a task is completed
      payment: {
        amount: { type: Number, required: true }, // The payment amount for this task
        paymentStatus: { type: Boolean, default: false }, // Indicates if the payment for this task is completed
        paymentDetails: { type: String }, // Optional: Details about the payment (e.g., transaction ID)
      },
    },
  ],
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
