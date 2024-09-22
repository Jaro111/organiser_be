const Job = require("./model");
const User = require("../user/model");

// Create a new job
const addJob = async (req, res) => {
  try {
    const newJob = new Job({
      title: req.body.title,
      owner: req.body.owner,
    });

    await newJob.save();

    res.status(200).json({ message: "Job created", job: newJob });
  } catch (error) {
    res.status(500).json({ message: error.messge });
  }
};

// get job by user id

const getJobByUserId = async (req, res) => {
  try {
    const job = await Job.find({ owner: req.body.owner }).populate("owner");

    res.status(200).json({ message: "Jobs uploaded", job: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addJob: addJob, getJobByUserId: getJobByUserId };
