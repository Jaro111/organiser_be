const { Router } = require("express");
const jobRouter = Router();

const {
  addJob,
  getAllJobsByUserId,
  inviteToJob,
  checkInvitations,
  acceptInvitation,
  getUsersByJobId,
} = require("./controller");

const { tokenCheck } = require("../middleware/auth");

// add new Job
jobRouter.post("/job/addJob", tokenCheck, addJob);

// Get all Jobs by user id

jobRouter.get("/job/getJobByUser", tokenCheck, getAllJobsByUserId);

// Get invited users which accepted invitation by job Id and tasks
jobRouter.post("/job/getInvitedUsers", getUsersByJobId);

// Invite to job
jobRouter.post("/job/inviteToJob", inviteToJob);

// checkInvitations

jobRouter.post("/job/checkInvitations", checkInvitations);

// acceptInvitation

jobRouter.post("/job/acceptInvitation", acceptInvitation);

module.exports = jobRouter;
