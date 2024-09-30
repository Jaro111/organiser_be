const Task = require("./model");
const Job = require("../job/model");

const addTask = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if the user is the owner or invited user

    const isOwner = (await job.owner.toString()) === req.authCheck.id;
    const isInvitedUser = await job.invitedUsers.some(
      (user) => user.user._id.toString() === req.authCheck.id && user.accepted
    );

    if (!isOwner && !isInvitedUser) {
      return res.status(403).json({ error: "You are not athorized" });
    }

    // Create the task
    const newTask = new Task({
      userId: req.body.userId,
      jobId: req.body.jobId,
      taskTitle: req.body.taskTitle,
    });

    await newTask.save();

    job.task.push(newTask._id);
    await job.save();

    return res.status(201).json({ message: "Task creted", task: newTask });
  } catch (error) {
    return res.status(500).json({ messaage: error.messaage, error: error });
  }
};

const updateTask = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if the user is the owner or invited user

    const isOwner = (await job.owner.toString()) === req.authCheck.id;
    const isInvitedUser = await job.invitedUsers.some(
      (user) => user.user._id.toString() === req.authCheck.id && user.accepted
    );

    if (!isOwner && !isInvitedUser) {
      return res.status(403).json({ error: "You are not athorized" });
    }
    const task = await Task.findById(req.body.taskId);

    if (!task) return res.status(404).json({ error: "Job not found" });

    // Update the task depends what You want to update. Title or update user Id

    if (req.body.whatToUpdate === "title") {
      task.taskTitle = req.body.update;
    }
    if (req.body.whatToUpdate === "userId") {
      task.userId = req.body.update;
    }

    await task.save(); // Save the updated task to the database

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

// delete task

const deleteTask = async (req, res) => {
  try {
    // Find the task
    const task = await Task.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // find the job
    const job = await Job.findById(req.body.jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if the user is the owner or invited user

    const isOwner = (await job.owner.toString()) === req.authCheck.id;
    const isInvitedUser = await job.invitedUsers.some(
      (user) => user.user._id.toString() === req.authCheck.id && user.accepted
    );

    if (!isOwner && !isInvitedUser) {
      return res.status(403).json({ error: "You are not athorized" });
    }
    // DELETE TASK
    await Task.findByIdAndDelete(req.body.taskId);

    // Remove it from job array
    await Job.findByIdAndUpdate(task.jobId, {
      $pull: { task: req.body.taskId },
    });
    res.status(200).json({ message: "Task successfully deleted " });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

// change task status

const updateTaskStatus = async (req, res) => {
  try {
    // Find the task
    const task = await Task.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // find the job
    const job = await Job.findById(req.body.jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if the user is the owner or invited user

    const isOwner = (await job.owner.toString()) === req.authCheck.id;
    const isInvitedUser = await job.invitedUsers.some(
      (user) => user.user._id.toString() === req.authCheck.id && user.accepted
    );

    if (!isOwner && !isInvitedUser) {
      return res.status(403).json({ error: "You are not athorized" });
    }
    if (req.body.status === "true") {
      task.status = true;
      await task.save();
    }
    if (req.body.status === "false") {
      task.status = false;
      await task.save();
    }

    res.status(200).json({ message: "Task status updated", task: task });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

module.exports = {
  addTask: addTask,
  updateTask: updateTask,
  deleteTask,
  updateTaskStatus,
};
