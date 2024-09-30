const Job = require("./model");
const User = require("../user/model");

// Create a new job
const addJob = async (req, res) => {
  try {
    const newJob = new Job({
      title: req.body.title,
      owner: req.authCheck.id,
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
    const userJobs = await Job.find({ owner: req.authCheck.id });
    const invitedJobs = await Job.find({
      "invitedUsers.user": req.authCheck.id,
      "invitedUsers.accepted": true,
    });
    const allJobs = [...userJobs, ...invitedJobs];

    res.status(200).json({ message: "Jobs uploaded", allJobs: allJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all invited users and job details by job Id with accepted invitations

const getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId)
      .populate({
        path: "owner",
        select: "username email",
      })
      .populate({
        path: "invitedUsers.user",
        select: "username email",
      })
      .populate({
        path: "task",
        select: "taskTitle userId",
      });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Filter users who accepted the invitation
    const acceptedUsers = job.invitedUsers.filter((user) => user.accepted);
    const owner = job.owner;
    const users = [];
    users.push(owner);
    acceptedUsers.map((user) => {
      users.push(user.user);
    });

    const response = {
      owner: job.owner,
      id: job._id,
      title: job.title,
      task: job.task,
      users: users,
    };

    res.status(200).json({ message: "Jobs uploaded", job: response });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
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

    if (job.owner.toString() !== req.authCheck.id)
      return res.status(403).json({ error: "only owner can invite users" });

    // check if the user is already in the invitedUserArray

    const alreadyInvited = job.invitedUsers.some(
      (u) => u.user.toString() === req.body.invitedUserId
    );
    if (alreadyInvited)
      return res.status(200).json({ message: "User already invited" });

    // Check if You are nit inviting yourself
    if (req.body.invitedUserId === req.authCheck.id)
      return res.status(200).json({ message: "You can't invite yourself" });

    // Finall if everyhing is fine add userId to invited list
    job.invitedUsers.push({ user: req.body.invitedUserId, accepted: false });
    await job.save();

    res.status(200).json({ message: "Successfully invited", job: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);

    res.status(200).json({ message: "Job uploaded", job: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    }).populate({
      path: "owner",
      select: "username email",
    });

    const filteredJobs = job
      .map((item) => {
        const filteredInvitedUsers = item.invitedUsers.filter(
          (invitee) =>
            invitee.user.toString() === req.body.userId &&
            invitee.accepted === false
        );
        if (filteredInvitedUsers.length > 0) {
          return {
            ...item.toObject(), // convert job to plain object to modify it
            invitedUsers: filteredInvitedUsers,
          };
        }
      })
      .filter((item) => item);

    res.status(200).json({ message: "Success", job: filteredJobs });
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};

// Accept
const acceptInvitation = async (req, res) => {
  try {
    // Find job by id
    const job = await Job.findById(req.body.jobId);
    console.log(job);

    const invitation = job.invitedUsers.find(
      (u) => u.user._id.toString() === req.authCheck.id && u.accepted === false
    );

    invitation.accepted = true;
    job.save();

    res
      .status(200)
      .json({ message: "Invitation accepted", invitation: invitation });
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
  getJobDetails: getJobDetails,
  getJobById: getJobById,
};
