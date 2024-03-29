const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema(
  {
    organisation: String,
    startDate: Date,
    endDate: Date,
    designation: String,
    location: String,
    description: String,
  },
  { _id: false }
);

const academicProjectSchema = new mongoose.Schema(
  {
    title: String,
    startMonth: String,
    endMonth: String,
    description: String,
    projectLink: String,
  },
  { _id: false }
);

const linksSchema = new mongoose.Schema(
  {
    portfolio: String,
    twitter: String,
    linkedin: String,
    behance: String,
    github: String,
    blog: String,
  },
  { _id: false }
);

const personalInformationSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    email: String,
    bio: String,
    designation: String,
    profileImage: String,
    filehash: String,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  workExperiences: [workExperienceSchema],
  academicProjects: [academicProjectSchema],
  links: [linksSchema],
  name: String,
  lastName: String,
  email: String,
  bio: String,
  profileImage: String,
  experience: String,
  education: String,
  skills: [String],
  achievements: [String],
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
