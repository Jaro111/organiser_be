const { Router } = require("express");
const userRouter = Router();

const { addUser } = require("./controller");

//add new user

userRouter.post("/user/addUser", addUser);

// get Users

module.exports = userRouter;
