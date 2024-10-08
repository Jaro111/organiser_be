const { Router } = require("express");
const jobRouter = Router();

const {
  addJob,
  getAllJobsByUserId,
  inviteToJob,
  checkInvitations,
  acceptInvitation,
  rejectInvitation,
  getJobDetails,
  getJobById,
  deleteJob,
  removeUserFromJob,
  editList,
} = require("./controller");

const { tokenCheck } = require("../middleware/auth");

// add new Job
jobRouter.post("/job/addJob", tokenCheck, addJob);

// Get all Jobs by user id

jobRouter.get("/job/getJobByUser", tokenCheck, getAllJobsByUserId);

// Get invited users which accepted invitation by job Id and tasks
jobRouter.post("/job/getJobDetails", tokenCheck, getJobDetails);
//
// getJobById
jobRouter.post("/job/getJobById", tokenCheck, getJobById);

// Invite to job
jobRouter.post("/job/inviteToJob", tokenCheck, inviteToJob);

// checkInvitations

jobRouter.post("/job/checkInvitations", checkInvitations);

// acceptInvitation

jobRouter.post("/job/acceptInvitation", tokenCheck, acceptInvitation);

// rejectInvitation
jobRouter.post("/job/rejectInvitation", tokenCheck, rejectInvitation);

// delete job
jobRouter.delete("/job/deleteJob", tokenCheck, deleteJob);

// remove user from job
jobRouter.post("/job/removeUserFromJob", tokenCheck, removeUserFromJob);

// editList
jobRouter.post("/job/editList", tokenCheck, editList);

module.exports = jobRouter;
