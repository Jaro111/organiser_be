const { Router } = require("express");
const jobRouter = Router();

const {
  addJob,
  getAllJobsByUserId,
  inviteToJob,
  checkInvitations,
  acceptInvitation,
  getJobDetails,
  getJobById,
} = require("./controller");

const { tokenCheck } = require("../middleware/auth");

// add new Job
jobRouter.post("/job/addJob", tokenCheck, addJob);

// Get all Jobs by user id

jobRouter.get("/job/getJobByUser", tokenCheck, getAllJobsByUserId);

// Get invited users which accepted invitation by job Id and tasks
jobRouter.post("/job/getJobDetails", tokenCheck, getJobDetails);
//
// getJonById
jobRouter.get("/job/getJobById", getJobById);

// Invite to job
jobRouter.post("/job/inviteToJob", tokenCheck, inviteToJob);

// checkInvitations

jobRouter.post("/job/checkInvitations", checkInvitations);

// acceptInvitation

jobRouter.post("/job/acceptInvitation", tokenCheck, acceptInvitation);

module.exports = jobRouter;
