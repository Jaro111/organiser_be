const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  colab: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      accepted: { type: Boolean, default: false },
    },
  ],
  task: [{ type: String }],
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
