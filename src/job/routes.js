const { Router } = require("express");
const jobRouter = Router();

const {
  addJob,
  getAllJobsByUserId,
  inviteToJob,
  checkInvitations,
  acceptInvitation,
} = require("./controller");

const { tokenCheck } = require("../middleware/auth");

// add new Job
jobRouter.post("/job/addJob", tokenCheck, addJob);

// View all Jobs by user id

jobRouter.get("/job/getJobByUser", tokenCheck, getAllJobsByUserId);

// Invite to job
jobRouter.post("/job/inviteToJob", inviteToJob);

// checkInvitations

jobRouter.post("/job/checkInvitations", checkInvitations);

// acceptInvitation

jobRouter.post("/job/acceptInvitation", acceptInvitation);

module.exports = jobRouter;
