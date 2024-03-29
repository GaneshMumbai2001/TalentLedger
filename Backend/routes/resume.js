const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "social@gigshub.xyz",
    pass: "vtlh yxlx otpp note",
  },
});

router.post("/send-email", (req, res) => {
  const { to } = req.body;
  const subject = "🚀 Welcome to GigsHub: Start Your Adventure!";
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { color: #7742FE; font-size: 24px; text-align: center; }
    .content { color: #333; font-size: 16px; line-height: 1.6; }
    .bold { font-weight: bold; }
    .button { background-color: #7742FE; color: white; padding: 10px 20px; text-align: center; display: inline-block; margin: 20px 0; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Welcome to GigsHub! 🌟</h1>
    <p class="content">We're super excited to have you with us. GigsHub is all about transforming your job search and employment experience. Get ready for an adventure where your skills earn you more than just a salary! 🌈</p>
    
    <p class="content"><span class="bold">Discover Incredible Jobs:</span> Find your perfect job match from a plethora of exciting opportunities.</p>
    <p class="content"><span class="bold">Earn Tokens & Rewards:</span> Engage with our platform and earn unique tokens and rewards.</p>
    <p class="content"><span class="bold">Shape Your Future:</span> Be part of a community that's redefining the job market.</p>
    <br/>
    <p class="content">Getting started is just a click away! <a href="https://www.gigshub.xyz/" class="button">Click Here</a></p>
    
    <p class="footer">If you have any questions or need assistance, we're just an email away.<br>Welcome to the family,<br>The GigsHub Team 🎉</p>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: "social@gigshub.xyz",
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent: " + info.response);
    }
  });
});

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  console.log("Token verification");
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = tokenHeader.split(" ")[1];

  jwt.verify(
    token,
    "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach the userId and did from the decoded token to the request
      req.userId = decoded.userId;
      req.did = decoded.did; // Assuming 'did' is included in the token payload
      next();
    }
  );
};

router.post("/create-resume", verifyToken, async (req, res) => {
  try {
    const {
      title,
      workExperiences,
      academicProjects,
      links,
      personalInformation,
      skills,
      achievements,
    } = req.body;

    console.log(
      title,
      workExperiences,
      academicProjects,
      links,
      personalInformation,
      skills,
      achievements
    );
    const userId = req.userId;
    console.log("hi");
    const did = req.did; // Get did from the request, which is set in the middleware
    console.log("did", did);

    // Create a new resume
    const newResume = new Resume({
      userId,
      title,
      did,
      workExperiences,
      academicProjects,
      links,
      personalInformation,
      skills,
      achievements,
    });
    await newResume.save();

    res.json({ message: "Resume created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT endpoint to modify an existing resume
router.put("/modify-resume", verifyToken, async (req, res) => {
  try {
    const {
      title,
      workExperiences,
      academicProjects,
      links,
      personalInformation,
      skills,
      achievements,
    } = req.body;
    const userId = req.userId;

    // Find the existing resume based on the user's ID
    const existingResume = await Resume.findOne({ userId });

    if (!existingResume) {
      return res
        .status(404)
        .json({ message: "Resume not found for this user" });
    }

    // Update the resume fields
    existingResume.title = title || existingResume.title;
    existingResume.workExperiences =
      workExperiences || existingResume.workExperiences;
    existingResume.academicProjects =
      academicProjects || existingResume.academicProjects;
    existingResume.links = links || existingResume.links;
    existingResume.personalInformation =
      personalInformation || existingResume.personalInformation;
    existingResume.skills = skills || existingResume.skills;
    existingResume.achievements = achievements || existingResume.achievements;

    // Save the updated resume
    await existingResume.save();

    res.json({ message: "Resume modified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to verify the JWT token and extract user ID
const verifyTokenAndGetUserId = (req, res, next) => {
  console.log("Token verification");
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = tokenHeader.split(" ")[1];

  jwt.verify(
    token,
    "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    }
  );
};

router.get("/get-resume/:did", async (req, res) => {
  try {
    const did = req.params.did;

    // Find the resume based on the user's DID
    const resume = await Resume.findOne({ did });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found for this user" });
    }

    // Return the user's resume data
    res.json({ resume });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
