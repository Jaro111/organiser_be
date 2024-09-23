const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
