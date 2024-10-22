const { Router } = require("express");
const userRouter = Router();

const { addUser, getAllUsers, logIn, updateUser } = require("./controller");
const { hashPass, comparePass, tokenCheck } = require("../middleware/auth");

//register new user

userRouter.post("/user/addUser", hashPass, addUser);

// LogIn

userRouter.post("/user/logIn", comparePass, logIn);

// get Users

userRouter.get("/user/getAll", tokenCheck, getAllUsers);

// tokenCheck

userRouter.get("/user/authCheck", tokenCheck, logIn);

// update User
userRouter.put("/user/updateUser", tokenCheck, updateUser);

module.exports = userRouter;
