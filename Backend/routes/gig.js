const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Gig = require("../models/Gig");
const User = require("../models/User");

const verifyTokenOfProvider = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const tokenValue = token.split(" ")[1];

  try {
    const decoded = jwt.verify(
      tokenValue,
      "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d"
    );
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    console.log(user);
    if (!user) {
      return res
        .status(403)
        .json({ message: "User is not authorized to post gigs" });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

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
      req.userId = decoded.userId;
      next();
    }
  );
};

// POST endpoint for posting a gig
router.post("/post-gig", verifyTokenOfProvider, async (req, res) => {
  try {
    const { title, description, budget, timeline, tasks, payments } = req.body;
    console.log(title, description, budget, timeline, tasks, payments);
    const userId = req.userId;
    const user = await User.findById(req.userId);
    const did = user.did;
    // Create a new gig
    const newGig = new Gig({
      title,
      description,
      budget,
      timeline,
      tasks,
      payments,
      didOfPosted: did,
      createdBy: userId,
      selectedCandidate: null,
    });
    await newGig.save();
    res.status(201).json({ message: "Gig posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/check-application/:gigId", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const gigId = req.params.gigId;
    const userDid = user.did;
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    const hasApplied = gig.applicants.includes(userDid);
    if (hasApplied) {
      return res.status(200).json({
        message: "User has already applied for this gig",
        applied: true,
      });
    } else {
      return res
        .status(200)
        .json({ message: "User has not applied for this gig", applied: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST endpoint for applying for a gig
router.post("/apply-for-gig/:gigId", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const gigId = req.params.gigId;
    const userDid = user.did;
    // Check if the gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    if (userId == gig.createdBy) {
      return res
        .status(403)
        .json({ message: "Creator of the gig cannot apply" });
    }
    // Check if the user has already applied for the gig
    if (gig.applicants.includes(userDid)) {
      return res
        .status(203)
        .json({ message: "You have already applied for this gig" });
    }
    // Update the gig's applicants array with the user's ID
    gig.applicants.push(userDid);
    await gig.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST endpoint for selecting a candidate for a gig
router.post(
  "/select-candidate/:gigId/:candidateId",
  verifyTokenOfProvider,
  async (req, res) => {
    console.log("Selecting candidate");
    try {
      const userId = req.userId;
      const gigId = req.params.gigId;
      const candidateId = req.params.candidateId;

      console.log("User ID: ", userId);
      console.log("Gig ID: ", gigId);
      console.log("Candidate ID: ", candidateId);
      // Check if the user making the request is the gig creator
      const gig = await Gig.findById(gigId).populate("createdBy");
      if (!gig || gig.createdBy._id.toString() !== userId) {
        console.log("issue in 403");
        return res.status(403).json({
          message: "You are not authorized to select a candidate for this gig",
        });
      }
      // Check if the selected candidate is in the gig's applicants list
      if (!gig.applicants.includes(candidateId)) {
        return res.status(400).json({
          message: "The selected candidate is not an applicant for this gig",
        });
      }
      // Update the gig's selectedCandidate field with the selected candidate's ID
      gig.selectedCandidate = candidateId;
      await gig.save();
      res.status(201).json({ message: "Candidate selected successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// GET endpoint for displaying applicants for a particular gig
router.get(
  "/gig-applicants/:gigId",
  verifyTokenOfProvider,
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
router.put("/complete-gig/:gigId", verifyTokenOfProvider, async (req, res) => {
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
router.put("/withdraw-gig/:gigId", verifyTokenOfProvider, async (req, res) => {
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
router.put("/drop-gig/:gigId", verifyTokenOfProvider, async (req, res) => {
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

// GET endpoint to get all posted gigs
router.get("/all-gigs", verifyToken, async (req, res) => {
  try {
    // Find all gigs in the database
    const allGigs = await Gig.find();

    res.json({ gigs: allGigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get("/get-gigs", verifyToken, async (req, res) => {
//   try {
//     // Get the postedByDid parameter from the query string
//     const { postedByDid } = req.query;

//     // If postedByDid is not provided, return a 400 Bad Request response
//     if (!postedByDid) {
//       return res
//         .status(400)
//         .json({ message: "postedByDid parameter is required" });
//     }

//     // Find gigs that have didOfPosted equal to the provided postedByDid
//     const filteredGigs = await Gig.find({ didOfPosted: postedByDid });

//     res.json({ gigs: filteredGigs });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.get(
  "/gigs-with-applicant/:applicantId",
  verifyToken,
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
router.get("/ongoinggigs/:applicantId", verifyToken, async (req, res) => {
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
router.get("/completed-gigs/:applicantId", verifyToken, async (req, res) => {
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

router.get("/get-gigs", verifyToken, async (req, res) => {
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
router.get("/get-current-gigs", verifyToken, async (req, res) => {
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
router.get("/get-completed-gigs", verifyToken, async (req, res) => {
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
router.put("/withdraw-from-gig/:gigId", verifyToken, async (req, res) => {
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
  verifyTokenOfProvider,
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
