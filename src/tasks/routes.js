const { Router } = require("express");
const taskRouter = Router();

const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("./controller");

const { tokenCheck } = require("../middleware/auth");

// add newTask

taskRouter.post("/task/addTask", tokenCheck, addTask);

// Update Task

taskRouter.post("/task/updateTask", tokenCheck, updateTask);

// delete task
taskRouter.delete("/task/deleteTask", tokenCheck, deleteTask);

// change task status
taskRouter.post("/task/updateTaskStatus", tokenCheck, updateTaskStatus);

module.exports = taskRouter;
