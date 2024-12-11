const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const authMiddleware = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

router.get("/", async (req, res) => {
  const { limit, offset, salary, name } = req.query;
  // const jobs = await Job.find().skip(offset).limit(limit);
  // const jobs = await Job.find({ salary: { $gte: 10000, $lte: 15000 } })
  //   .skip(offset)
  //   .limit(limit);
  // const jobs = await Job.find({ salary }).skip(offset).limit(limit);
  const jobs = await Job.find({
    companyName: { $regex: name, $options: "i" },
  })
    .skip(offset)
    .limit(limit);
  res.status(200).json(jobs);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return res.status(400).json({ message: "Job not found" });
  }
  res.status(200).json(job);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  const userId = req.user.id;

  if (!job) {
    return res.status(400).json({ message: "Job not found" });
  }
  // check if user is owner of job
  if (userId !== job.user.toString()) {
    return res
      .status(401)
      .json({ message: "You are not authorised to delete this job" });
  }
  await Job.deleteOne({ _id: id });
  res.status(200).json({ message: "Job deleted successfully" });
});

router.post("/", authMiddleware, async (req, res) => {
  const { companyName, jobPosition, salary, jobType } = req.body;
  if (!companyName || !jobPosition || !salary || !jobType) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const user = req.user;
    const job = await Job.create({
      companyName,
      jobPosition,
      salary,
      jobType,
      user: user.id,
    });
    res.status(200).json(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in creating job" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { companyName, jobPosition, salary, jobType } = req.body;
  const job = await Job.findById(id);
  if (!job) {
    return res.status(400).json({ message: "Job not foumd" });
  }

  if (req.user.id !== job.user.toString()) {
    return res
      .status(401)
      .json({ message: "You are not authorized to update the job" });
  }

  try {
    await Job.findByIdAndUpdate(id, {
      companyName,
      jobPosition,
      salary,
      jobType,
    });
    res.status(200).json({ message: "Job updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in updating job" });
  }
});

module.exports = router;
