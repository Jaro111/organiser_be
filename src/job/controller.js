const Job = require("./model");
const User = require("../user/model");

// Create a new job
const addJob = async (req, res) => {
  try {
    const newJob = new Job({
      title: req.body.title,
      owner: req.body.userId,
    });

    await newJob.save();

    res.status(200).json({ message: "Job created", job: newJob });
  } catch (error) {
    res.status(500).json({ message: error.messge });
  }
};

// get all jobs by user id

const getAllJobsByUserId = async (req, res) => {
  try {
    const userJobs = await Job.find({ owner: req.body.userId });
    const invitedJobs = await Job.find({
      "invitedUsers.user": req.body.userId,
      "invitedUsers.accepted": true,
    });

    const allJobs = [...userJobs, ...invitedJobs];

    res.status(200).json({ message: "Jobs uploaded", allJobs: allJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// invite user to job

// 1. Check if the job exist
// 2. Check if the owner of the job is inviting, else return false
// 3. Invite user
const inviteToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    // Check if job exist
    if (!job) return res.status(500).json({ error: "Job not found" });
    // Check the owner

    if (job.owner.toString() !== req.body.ownerId)
      return res.status(403).json({ error: "only owner can invite users" });

    // check if the user is already in the invitedUserArray

    const alreadyInvited = job.invitedUsers.some(
      (u) => u.user.toString() === req.body.invitedUserId
    );
    if (alreadyInvited)
      return res.status(200).json({ message: "User already invited" });

    // Check if You are nit inviting yourself
    if (req.body.invitedUserId === req.body.ownerId)
      return res.status(200).json({ message: "You can't invite yourself" });

    // Finall if everyhing is fine add userId to invited list
    job.invitedUsers.push({ user: req.body.invitedUserId, accepted: false });
    await job.save();

    res.status(200).json({ message: "User invited", job: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//

// accept invitattion
// 1. find a job where invited users include my id. If not found return "No invitations"
// 2. Set status to true

// Find pending Invitations
const checkInvitations = async (req, res) => {
  try {
    // look for my id in job.invitedUsers with status: false

    const job = await Job.find({
      "invitedUsers.user": req.body.userId,
      "invitedUsers.accepted": false,
    });

    res.status(200).json({ message: "Success", job: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept
const acceptInvitation = async (req, res) => {
  try {
    // Find job by id
    const job = await Job.findById(req.body.jobId);
    console.log(job);

    const invitation = job.invitedUsers.find(
      (u) => u.user._id.toString() === req.body.userId && u.accepted === false
    );

    invitation.accepted = true;
    job.save();

    res.status(200).json({ message: "Success", invitation: invitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addJob: addJob,
  getAllJobsByUserId: getAllJobsByUserId,
  inviteToJob: inviteToJob,
  checkInvitations: checkInvitations,
  acceptInvitation: acceptInvitation,
};
