const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  shopingList: [
    {
      title: { type: String, required: true },
      status: { type: Boolean, default: false },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  invitedUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      accepted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
