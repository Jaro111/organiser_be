require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5001;
const connection = require("../src/db/connection");
const userRouter = require("./user/routes");
const jobRouter = require("./job/routes");

const app = express();

app.use(express.json());

connection();

app.use(userRouter, jobRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
