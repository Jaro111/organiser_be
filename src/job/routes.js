const { Router } = require("express");
const jobRouter = Router();

const { addJob, getJobByUserId } = require("./controller");

// add new Job
jobRouter.post("/job/addJob", addJob);

// View all Jobs by user id

jobRouter.get("/job/getJobByUser", getJobByUserId);

module.exports = jobRouter;
