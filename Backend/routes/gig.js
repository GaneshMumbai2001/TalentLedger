const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Gig = require("../models/Gig");
const User = require("../models/User");

router.post("/post-gig", async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      budget,
      timeline,
      tasks,
      payments,
      skills,
      escrowId,
    } = req.body;

    let combinedTasks = tasks.map((description, index) => ({
      description: description,
      completed: false,
      payment: {
        amount: payments[index] || 0,
        paymentStatus: false,
        paymentDetails: "",
      },
    }));

    const newGig = new Gig({
      title,
      description,
      budget,
      timeline,
      tasks: combinedTasks,
      createdBy: address,
      selectedCandidate: null,
      skillsRequired: skills,
      escrowId: escrowId,
      providerAddress: address,
    });
    await newGig.save();
    res.status(201).json({ message: "Gig posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/appliedGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    console.log("userid", userDid);

    // Find all gigs where the user's DID is in the applicants array
    const appliedGigs = await Gig.find({
      applicants: userDid,
      completed: false,
      selectedCandidate: null,
      dropped: false,
    });

    console.log("applied gigs,", appliedGigs);

    if (appliedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(appliedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/PostedGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const appliedGigs = await Gig.find({
      createdBy: userDid,
      completed: false,
      selectedCandidate: null,
      dropped: false,
    });

    if (appliedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(appliedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/PostedOnGoingGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const appliedGigs = await Gig.find({
      createdBy: userDid,
      completed: false,
      selectedCandidate: { $ne: null },
      dropped: false,
    });

    if (appliedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(appliedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/PostedOnCancelledGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const appliedGigs = await Gig.find({ createdBy: userDid, dropped: true });

    if (appliedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(appliedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/PostedOnCompletedGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const appliedGigs = await Gig.find({
      createdBy: userDid,
      completed: true,
      selectedCandidate: { $ne: null },
      dropped: false,
    });

    if (appliedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(appliedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/selectedGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const selectedGigs = await Gig.find({
      selectedCandidate: userDid,
      withdrawal: false,
      completed: false,
    });

    if (selectedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(selectedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/completedGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const selectedGigs = await Gig.find({
      selectedCandidate: userDid,
      withdrawal: false,
      completed: true,
    });

    if (selectedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(selectedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/CancelledGigs", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDid = user._id;

    // Find all gigs where the user's DID is in the applicants array
    const selectedGigs = await Gig.find({
      selectedCandidate: userDid,
      withdrawal: true,
      completed: false,
    });

    if (selectedGigs.length === 0) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    // Return the gigs for which the user has applied
    return res.status(200).json(selectedGigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/gigApplicants", async (req, res) => {
  try {
    // console.log(req);
    const gigId = req.query.gigId; // Adjusted to use query parameter
    console.log("Gig ID: ", gigId);
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "User not found" });
    }
    const applicantUserIds = gig.applicants; // Assuming this is an array of userIds
    console.log("applicantUserIds", applicantUserIds);
    // Find resumes for all applicants of this gig
    const applicantResumes = await Resume.find({
      userId: { $in: applicantUserIds }, // Use $in to select documents where userId matches any in the applicants array
    });

    console.log("applicantResumes", applicantResumes);

    if (applicantResumes.length === 0) {
      return res
        .status(404)
        .json({ message: "No resumes found for applicants" });
    }

    return res.status(200).json(applicantResumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/apply-for-gig", async (req, res) => {
  try {
    const { gigId, address } = req.body;
    console.log("Gig ID: ", gigId);
    const userId = address;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    if (userId == gig.createdBy) {
      return res
        .status(403)
        .json({ message: "Creator of the gig cannot apply" });
    }
    if (gig.applicants.includes(userId)) {
      return res
        .status(203)
        .json({ message: "You have already applied for this gig" });
    }
    gig.applicants.push(userId);
    await gig.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/selectApplicant", async (req, res) => {
  console.log("Selecting candidate");
  try {
    const { gigId, applicantId } = req.body; // Or wherever these values are coming from

    const userId = req.userId;

    console.log("User ID: ", applicantId);
    console.log("Gig ID: ", gigId);

    console.log("applicant Id", applicantId);

    // Check if the user making the request is the gig creator
    const gig = await Gig.findById(gigId);

    const Applicant = await User.findById(applicantId);
    console.log("applicant", Applicant);

    console.log("Gig", gig);
    if (!gig || gig.createdBy._id.toString() !== userId) {
      console.log("issue in 403");
      return res.status(403).json({
        message: "You are not authorized to select a candidate for this gig",
      });
    }
    // Check if the selected candidate is in the gig's applicants list
    if (!gig.applicants.includes(applicantId)) {
      return res.status(400).json({
        message: "The selected candidate is not an applicant for this gig",
      });
    }
    // Update the gig's selectedCandidate field with the selected candidate's ID
    gig.selectedCandidate = applicantId;
    await gig.save();
    res.status(201).json({
      message: "Candidate selected successfully",
      userAddress: Applicant.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/notifyAsComplete", async (req, res) => {
  console.log("Notifying as complete");

  const { gigId, taskId } = req.body;

  try {
    const userId = req.userId;
    console.log("userId", userId);
    const gig = await Gig.findById(gigId);

    console.log("gig", gig);

    if (!gig) {
      return res.status(404).send({ message: "Gig not found" });
    }

    if (gig.selectedCandidate !== userId) {
      return res
        .status(403)
        .send({ message: "User is not the selected candidate for this gig" });
    }

    const task = gig.tasks.find((task) => task._id.toString() === taskId);
    console.log("task", task);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (task.completed) {
      return res
        .status(400)
        .send({ message: "Task is already marked as completed" });
    }

    // Mark the task as completed
    task.completed = true;

    await gig.save();

    res.status(201).send({ message: "Task marked as completed" });
  } catch (error) {
    console.error("Failed to update task status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
router.post("/notifyAsClaimed", async (req, res) => {
  console.log("Notifying as Claimed");

  const { gigId, taskId } = req.body;

  try {
    const userId = req.userId;
    console.log("userId", userId);
    const gig = await Gig.findById(gigId);

    console.log("gig", gig);

    if (!gig) {
      return res.status(404).send({ message: "Gig not found" });
    }

    if (gig.selectedCandidate !== userId) {
      return res
        .status(403)
        .send({ message: "User is not the selected candidate for this gig" });
    }

    const task = gig.tasks.find((task) => task._id.toString() === taskId);
    console.log("task", task);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (task.payment.paymentStatus) {
      return res
        .status(400)
        .send({ message: "Task is already marked as completed" });
    }

    // Mark the task as completed
    task.payment.paymentStatus = true;

    await gig.save();

    res.status(201).send({ message: "Task marked as completed" });
  } catch (error) {
    console.error("Failed to update task status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
router.post(
  "/taskUpdateFromProvider",

  async (req, res) => {
    console.log("taskUpdateFromProvider");

    const { gigId, taskId } = req.body;

    try {
      const userId = req.userId;
      console.log("userId", userId);
      const gig = await Gig.findById(gigId);

      console.log("gig", gig);

      if (!gig) {
        return res.status(404).send({ message: "Gig not found" });
      }

      if (gig.createdBy._id.toString() !== userId) {
        console.log("issue in 403");
        return res.status(403).json({
          message: "You are not the provider who posted this gig",
        });
      }

      const task = gig.tasks.find((task) => task._id.toString() === taskId);
      console.log("task", task);

      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }

      if (task.payment.paymentDetails !== "") {
        return res
          .status(400)
          .send({ message: "Payment detail is already updated" });
      }

      // Mark the task as completed
      task.payment.paymentDetails = "Allow";

      await gig.save();

      res.status(201).send({ message: "Task marked as completed" });
    } catch (error) {
      console.error("Failed to update task status:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

// GET endpoint for displaying applicants for a particular gig
router.get(
  "/gig-applicants/:gigId",

  async (req, res) => {
    try {
      const userId = req.userId;
      const gigId = req.params.gigId;
      // Check if the user making the request is the gig creator
      const gig = await Gig.findById(gigId).populate("createdBy");
      if (!gig || gig.createdBy._id.toString() !== userId) {
        return res.status(403).json({
          message: "You are not authorized to view applicants for this gig",
        });
      }
      // Return the applicants array
      res.json({ applicants: gig.applicants });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// PUT endpoint to update the completed status of a gig
router.put("/complete-gig/:gigId", async (req, res) => {
  try {
    const gigId = req.params.gigId;

    // Find the gig based on the gig ID
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    if (gig.withdrawal) {
      return res.status(403).json({ message: "Gig is already withdrawn" });
    }
    if (gig.completed) {
      return res.status(403).json({ message: "Gig is already completed" });
    }
    // Update the completed status
    gig.completed = true;
    await gig.save();
    res.json({ message: "Gig marked as completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT endpoint to update the withdrawal status of a gig
router.put("/withdraw-gig/:gigId", async (req, res) => {
  try {
    const gigId = req.params.gigId;
    // Find the gig based on the gig ID
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Update the withdrawal status
    gig.withdrawal = true;
    await gig.save();

    res.json({ message: "Gig marked as withdrawn" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT endpoint to update the dropped status of a gig
router.put("/drop-gig/:gigId", async (req, res) => {
  try {
    const gigId = req.params.gigId;

    // Find the gig based on the gig ID
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Update the dropped status
    gig.dropped = true;
    await gig.save();

    res.json({ message: "Gig marked as dropped" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all-gigs", async (req, res) => {
  try {
    const allGigs = await Gig.find();

    res.status(200).json({ gigs: allGigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/gigs-with-applicant/:applicantId",

  async (req, res) => {
    console.log("Gigs with applicant");
    try {
      const applicantId = req.params.applicantId;
      console.log("Applicant ID: ", applicantId);

      // Find all gigs that have the specified applicant in the applicants array
      const gigsWithApplicant = await Gig.find({ applicants: applicantId });
      console.log("Gigs with applicant: ", gigsWithApplicant);

      res.json({ gigs: gigsWithApplicant });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.get("/ongoinggigs/:applicantId", async (req, res) => {
  console.log("Gigs with applicant");
  try {
    const applicantId = req.params.applicantId;
    console.log("Applicant ID: ", applicantId);

    // Find all gigs that have the specified applicant in the applicants array
    const gigsWithApplicant = await Gig.find({
      selectedCandidate: applicantId,
      completed: false,
    });
    console.log("Gigs with applicant: ", gigsWithApplicant);

    res.status(201).json({ gigs: gigsWithApplicant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/completed-gigs/:applicantId", async (req, res) => {
  console.log("Gigs with applicant");
  try {
    const applicantId = req.params.applicantId;
    console.log("Applicant ID: ", applicantId);

    // Find all gigs that have the specified applicant in the applicants array
    const gigsWithApplicant = await Gig.find({
      selectedCandidate: applicantId,
      completed: true,
    });
    console.log("Gigs with applicant: ", gigsWithApplicant);

    res.status(201).json({ gigs: gigsWithApplicant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-gigs", async (req, res) => {
  try {
    // Access the decoded user information from the JWT token
    const decodedToken = req.user;

    const userId = req.userId;

    const user = await User.findById(req.userId);
    const did = user.did;

    console.log("User ID: ", did);
    // Extract the did from the decoded token
    // const postedByDid = decodedToken.did;

    // If postedByDid is not provided, return a 400 Bad Request response
    if (!did) {
      return res
        .status(400)
        .json({ message: "Could not extract did from JWT token" });
    }

    // Find gigs that have didOfPosted equal to the provided postedByDid
    const filteredGigs = await Gig.find({ didOfPosted: did });

    console.log("Filtered Gigs: ", filteredGigs);

    res.json({ gigs: filteredGigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/get-current-gigs", async (req, res) => {
  try {
    // Access the decoded user information from the JWT token
    const decodedToken = req.user;

    const userId = req.userId;

    const user = await User.findById(req.userId);
    const did = user.did;

    console.log("User ID: ", did);
    // Extract the did from the decoded token
    // const postedByDid = decodedToken.did;

    if (!did) {
      return res
        .status(400)
        .json({ message: "Could not extract did from JWT token" });
    }

    // Find gigs that have didOfPosted equal to the provided postedByDid
    const filteredGigs = await Gig.find({
      didOfPosted: did,
      selectedCandidate: { $ne: null },
      completed: false,
    });

    console.log("Current Gigs: ", filteredGigs);

    res.status(201).json({ gigs: filteredGigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/get-completed-gigs", async (req, res) => {
  try {
    // Access the decoded user information from the JWT token
    const decodedToken = req.user;

    const userId = req.userId;

    const user = await User.findById(req.userId);
    const did = user.did;

    console.log("User ID: ", did);
    // Extract the did from the decoded token
    // const postedByDid = decodedToken.did;

    if (!did) {
      return res
        .status(400)
        .json({ message: "Could not extract did from JWT token" });
    }

    // Find gigs that have didOfPosted equal to the provided postedByDid
    const filteredGigs = await Gig.find({
      didOfPosted: did,
      selectedCandidate: { $ne: null },
      completed: true,
    });

    console.log("completed Gigs: ", filteredGigs);

    res.status(201).json({ gigs: filteredGigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT endpoint to allow the selected candidate to withdraw from the gig
router.put("/withdraw-from-gig/:gigId", async (req, res) => {
  try {
    const gigId = req.params.gigId;

    // Find the gig based on the gig ID
    const gig = await Gig.findById(gigId);

    const userId = req.userId;

    const user = await User.findById(userId);
    const userDid = user.did;

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Check if there is a selected candidate
    if (!gig.selectedCandidate) {
      return res
        .status(400)
        .json({ message: "No selected candidate for this gig" });
    }

    // Check if the authenticated user is the selected candidate
    if (gig.selectedCandidate.toString() !== userDid) {
      return res
        .status(403)
        .json({ message: "You are not the selected candidate for this gig" });
    }

    // Withdraw the selected candidate from the gig
    gig.selectedCandidate = null;
    await gig.save();

    res.json({ message: "Successfully withdrew from the gig" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/mark-paid-to-escrow/:gigId",

  async (req, res) => {
    try {
      const gigId = req.params.gigId;

      // Find the gig based on the gig ID
      const gig = await Gig.findById(gigId);

      if (!gig) {
        return res.status(404).json({ message: "Gig not found" });
      }
      if (gig.gigPaidToEscrow) {
        return res.status(403).json({ message: "Gig already paid to escrow" });
      }

      // Update the paid to escrow status
      gig.gigPaidToEscrow = true;
      await gig.save();

      res.json({ message: "Gig marked as paid to escrow" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
