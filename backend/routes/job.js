const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const authMiddleware = require("../middleware/auth");
// const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv");
dotenv.config();

router.get("/", async (req, res) => {
  setTimeout(async () => {
    const { limit, offset, salary, name, skillsRequired } = req.query;

    const query = {};
    if (salary) {
      query.salary = { $gte: salary, $lte: salary };
    }
    if (name) {
      query.skillsRequired = { $regex: name, $options: "i" };
    }
    if (skillsRequired) {
      // all skills must be in the skills array
      query.skillsRequired = { $all: skillsRequired.split(",") };
      // Atleast one skill must be in the skills array
      query.skillsRequired = { $in: skillsRequired.split(",") };
    }
    const jobs = await Job.find(query)
      .skip(offset || 0)
      .limit(limit || 50);
    const count = await Job.countDocuments(query);
    // const jobs = await Job.find().skip(offset).limit(limit);
    // const jobs = await Job.find({ salary: { $gte: 10000, $lte: 15000 } })
    //   .skip(offset)
    //   .limit(limit);
    // const jobs = await Job.find({ salary }).skip(offset).limit(limit);
    // const jobs = await Job.find({
    //   companyName: { $regex: name, $options: "i" },
    // })
    //   .skip(offset)
    //   .limit(limit);
    // const jobs = await Job.find(
    //   { companyName: { $regex: name || "", $options: "i" } },
    //   { salary: salary || "" }
    // )
    //   .skip(offset || 0)
    //   .limit(limit || 10);
    res.status(200).json({ jobs, count });
  }, 5000);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
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

router.get("/api/jobs/:skillsRequired", async (req, res, next) => {
  try {
    const skills = req.params.skillsRequired;
    const parsedSkills = JSON.parse(skills);
    const lowercaseSkills = parsedSkills.map((skill) => skill.toLowerCase());
    console.log(lowercaseSkills);
    const jobs = await Job.find({ skills: { $in: lowercaseSkills } });

    res.send({
      status: "SUCCESS",
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (err) {
    console.log(err);
    next(new Error("Something went wrong! Please try after some time."));
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const {
    companyName,
    logoUrl,
    jobPosition,
    salary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skillsRequired,
  } = req.body;
  if (
    !companyName ||
    !logoUrl ||
    !jobPosition ||
    !salary ||
    !jobType ||
    !remote ||
    !location ||
    !jobDescription ||
    !aboutCompany ||
    !skillsRequired
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const skillsArray = Array.isArray(skillsRequired)
    ? skillsRequired.map((skill) => skill.trim())
    : skillsRequired.split(",").map((skill) => skill.trim());
  try {
    const user = req.user;
    console.log(user);
    const job = await Job.create({
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      jobDescription,
      aboutCompany,
      skillsRequired: skillsArray,
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
  const {
    companyName,
    logoUrl,
    jobPosition,
    salary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skillsRequired,
    date,
  } = req.body;
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
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      jobDescription,
      aboutCompany,
      skillsRequired,
    });
    res.status(200).json({ message: "Job updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in updating job" });
  }
});

module.exports = router;
