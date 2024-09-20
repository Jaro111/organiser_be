const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  colab: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      accepted: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("Task", taskSchema);
