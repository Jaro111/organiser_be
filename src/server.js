require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Needed for Socket.IO
const { Server } = require("socket.io"); // Import socket.io
const port = process.env.PORT || 5001;
const connection = require("../src/db/connection");
const userRouter = require("./user/routes");
const jobRouter = require("./job/routes");
const taskRouter = require("./tasks/routes");
const Job = require("../src/job/model");
const Task = require("../src/tasks/model");

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io and bind it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust as necessary for security
    methods: ["GET", "POST", "DELETE"],
  },
});

connection()
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Setup socket.io connection
io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  // Add other event listeners if needed
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

app.use(userRouter);
app.use(jobRouter);
app.use(taskRouter);

// Watch Job collection for changes
const jobChangeStream = Job.watch();
jobChangeStream.on("change", (change) => {
  console.log("Job change detected:", change);

  // Example: if a job is created
  if (change.operationType === "insert") {
    const newJob = change.fullDocument;
    io.emit("newJob", newJob); // Emit the new job to all connected clients
  }

  // Example: if a job is updated
  if (change.operationType === "update") {
    const updatedJob = change.updateDescription.updatedFields;
    io.emit("updateJob", updatedJob); // Emit the updated job to all clients
  }

  // Handle other MongoDB change events (like delete) as needed
});

// Watch Task collection for changes
const taskChangeStream = Task.watch();
taskChangeStream.on("change", (change) => {
  console.log("Task change detected:", change);

  // Example: if a task is created
  if (change.operationType === "insert") {
    const newTask = change.fullDocument;
    io.emit("insertTask", newTask); // Emit the new task to all clients
  }

  // Example: if a task is updated
  if (change.operationType === "update") {
    const updatedTask = change.updateDescription.updatedFields;
    io.emit("updateTask", updatedTask); // Emit the updated task to all clients
  }

  // Example: if a task is deleted
  if (change.operationType === "delete") {
    const deletedTaskId = change.documentKey._id;
    io.emit("deleteTask", {
      taskId: deletedTaskId,
    }); // Emit the deleted task ID to all clients
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });
