require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5001;
const connection = require("../src/db/connection");

const app = express();

app.use(express.json());

connection();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API healthy" });
});
