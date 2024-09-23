const { Router } = require("express");
const userRouter = Router();

const { addUser, getAllUsers } = require("./controller");

//add new user

userRouter.post("/user/addUser", addUser);

// get Users

userRouter.get("/user/getAll", getAllUsers);

module.exports = userRouter;
