const Job = require("./model");
const User = require("../user/model");
const Task = require("../tasks/model");

// Create a new job
const addJob = async (req, res) => {
  try {
    // check if the user is already in the invitedUserArray

    const { title } = req.body;
    const newJob = new Job({
      title: title,
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
        select: "taskTitle userId status",
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
    const job = await Job.findById(req.body.jobId).populate({
      path: "shopingList.userId",
      select: "username",
    });

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
// reject Invitation
const rejectInvitation = async (req, res) => {
  // Body Var
  const { jobId } = req.body;

  const job = await Job.findById(jobId);

  const isInvitedUser = await job.invitedUsers.some(
    (user) =>
      user.user._id.toString() === req.authCheck.id && user.accepted === false
  );

  if (!isInvitedUser) {
    res.status(403).json({ message: "You are not authorized" });
  }
  updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      $pull: { invitedUsers: { user: req.authCheck.id } },
    },
    { new: true }
  );
  res.status(200).json({ message: "Invitation rejected" });

  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete job

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    // Check if job exist
    if (!job) return res.status(500).json({ error: "Job not found" });
    // Check the owner

    if (job.owner.toString() !== req.authCheck.id)
      return res.status(403).json({ error: "Only owner can delete job" });

    // find and delete tasks

    await Task.deleteMany({ jobId: req.body.jobId });

    // Delete job

    await Job.findByIdAndDelete(job._id);

    //
    res.status(200).json({ message: "Successfully Deleted Job" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove user from a job
const removeUserFromJob = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    // Check if job exist
    if (!job) return res.status(500).json({ error: "Job not found" });
    // Check the owner

    if (job.owner.toString() !== req.authCheck.id)
      return res.status(403).json({ error: "Only owner is authorized" });

    // Remove user from list
    const updatedJob = await Job.findByIdAndUpdate(
      req.body.jobId,
      { $pull: { invitedUsers: { user: req.body.invitedUserId } } }, // $pull based on the user field inside invitedUsers array
      { new: true } // Return the updated document after modification
    );

    res.status(200).json({ message: "Updated", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editList = async (req, res) => {
  try {
    // find the job
    const job = await Job.findById(req.body.jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if the user is the owner or invited user

    const isOwner = (await job.owner.toString()) === req.authCheck.id;
    const isInvitedUser = await job.invitedUsers.some(
      (user) => user.user._id.toString() === req.authCheck.id && user.accepted
    );

    if (!isOwner && !isInvitedUser) {
      return res.status(403).json({ error: "You are not athorized" });
    }
    // add Task
    if (req.body.action === "add") {
      await job.shopingList.push({
        title: req.body.title,
        status: false,
        userId: req.authCheck.id,
      });
      await job.save();
      const updatedJob = await Job.findById(req.body.jobId);
      res.status(200).json({ message: "Updated", job: updatedJob });
    }
    // Delete
    if (req.body.action === "delete") {
      const updatedJob = await Job.findByIdAndUpdate(
        job._id,
        {
          $pull: { shopingList: { _id: req.body.itemId } },
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated", job: updatedJob });
    }
    // clear
    if (req.body.action === "clear") {
      job.shopingList = [];
      job.save();

      const updatedJob = await Job.findById(req.body.jobId);
      res.status(200).json({ message: "Updated", job: updatedJob });
    }
    // update status
    if (req.body.action === "updateStatus") {
      const shopingListItem = job.shopingList.find(
        (item) => item._id.toString() === req.body.itemId
      );
      shopingListItem.status = !shopingListItem.status;
      shopingListItem.userId = req.authCheck.id;
      await job.save();

      res.status(200).json({ message: "Updated", item: shopingListItem });
    }
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
  rejectInvitation: rejectInvitation,
  getJobDetails: getJobDetails,
  getJobById: getJobById,
  deleteJob: deleteJob,
  removeUserFromJob: removeUserFromJob,
  editList: editList,
};
