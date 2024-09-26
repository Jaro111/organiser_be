const { Router } = require("express");
const taskRouter = Router();

const { addTask, updateTask } = require("./controller");

const { tokenCheck } = require("../middleware/auth");
const auth = require("../middleware/auth");

// add newTask

taskRouter.post("/task/addTask", tokenCheck, addTask);

// Update Task

taskRouter.post("/task/updateTask", tokenCheck, updateTask);

module.exports = taskRouter;
