const { Router } = require("express");
const jobRouter = Router();

const {
  addJob,
  getJobByUserId,
  inviteToJob,
  checkInvitations,
  acceptInvitation,
} = require("./controller");

// add new Job
jobRouter.post("/job/addJob", addJob);

// View all Jobs by user id

jobRouter.get("/job/getJobByUser", getJobByUserId);

// Invite to job
jobRouter.post("/job/inviteToJob", inviteToJob);

// checkInvitations

jobRouter.post("/job/checkInvitations", checkInvitations);

// acceptInvitation

jobRouter.post("/job/acceptInvitation", acceptInvitation);

module.exports = jobRouter;
