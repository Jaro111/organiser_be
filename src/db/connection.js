const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

const connection = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
