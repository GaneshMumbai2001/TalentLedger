const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const { Octokit } = require("@octokit/core");

const abi = require("../helpers/abi.json");

const tokenAbi = require("../helpers/token.json");

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

async function transferTokensInBackground(wallet, address, amount) {
  const tokenContract = new ethers.Contract("", tokenAbi, wallet);
  try {
    const val = ethers.utils.parseUnits(amount, "wei");

    const transferPromise = await tokenContract.transfer(address, val);
    await transferPromise.wait();

    console.log("transfer", transferPromise);
  } catch (error) {
    console.error(`Error transferring tokens to ${address}: ${error}`);
  }
}

router.post("/register", async (req, res) => {
  const { signature, address, did, v, r, s, message, type } = req.body;

  try {
    const existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/gOG88l1cDipGocv9D-5tprcpQO-xI0a4"
    );
    const wallet = new ethers.Wallet(
      "ec7a98c5a34e586ce08168dea9176d74186349b1bf56c336ca861a416367136a",
      provider
    );
    const contract = new ethers.Contract(
      "0x821237A1A5f060E165C4Cb727a104088b9d5B807",
      abi,
      wallet
    );

    const transaction = await contract.Create(did, message, v, r, s);
    await transaction.wait();

    const newUser = await User.create({
      signature: signature,
      persona: type,
      address: address,
      did: did,
    });

    const token = jwt.sign(
      { userId: newUser._id, did: did },
      "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
      { expiresIn: "24h" }
    );
    res.status(200).json({ message: "Registration successful!", token });
    transferTokensInBackground(wallet, address, "100000000000000000000");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/signup", async (req, res) => {
  const {
    address,
    name,
    lastName,
    email,
    designation,
    bio,
    profileImage,
    skills,
    achievements,
    workExperience,
    projects,
    links,
    signature,
    type,
  } = req.body;
  console.log(
    address,
    name,
    lastName,
    email,
    designation,
    bio,
    profileImage,
    skills,
    achievements,
    workExperience,
    projects,
    links,
    signature,
    type
  );

  try {
    const existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }
    const newUser = await User.create({
      signature: signature,
      persona: type,
      address: address,
      name: name,
      lastName: lastName,
      did: name,
    });

    const newUserResume = await Resume.create({
      userId: newUser._id,
      title: designation,

      workExperiences: workExperience,
      academicProjects: projects,
      links: links,
      name: name,
      lastName: lastName,
      email: email,
      bio: bio,
      skills: skills,
      achievements: achievements,
    });

    const token = jwt.sign(
      { userId: newUser._id, name: name },
      "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
      { expiresIn: "24h" }
    );
    res.status(200).json({ message: "Registration successful!", token });
  } catch (error) {
    console.error(error);
  }
});
router.post("/onboardProvider", async (req, res) => {
  const {
    address,
    name,
    lastName,
    email,
    twitter,
    discord,
    signature,
    type,
    message,
    v,
    r,
    s,
  } = req.body;
  console.log(
    address,
    name,
    lastName,
    email,
    twitter,
    discord,
    signature,
    type,
    message,
    v,
    r,
    s
  );

  try {
    const existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const did = name + lastName;
    const newUser = await User.create({
      signature: signature,
      persona: type,
      address: address,
      name: name,
      lastName: lastName,
      did: did,
    });

    const newProvider = await Provider.create({
      userId: newUser._id,
      email: email,
      twitter,
      discord,
    });

    console.log("provider created", newProvider);

    const token = jwt.sign(
      { userId: newUser._id, name: name },
      "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
      { expiresIn: "24h" }
    );
    res.status(200).json({ message: "Registration successful!", token });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findOne({ address });

    console.log(address);

    console.log("user", user);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "048af2438891a89a3536ac09cc96ccbd34a1714e88cf8fdb63e6186dcc3ff89d",
      {
        expiresIn: "24h",
      }
    );

    const name = user.name;
    const lastName = user.lastName;

    const type = user.persona;

    res.status(200).json({
      token: token,
      name: name,
      lastName: lastName,
      persona: type,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/getUser", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const octokit = new Octokit({
  auth: "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",
});

router.get("/repo/:owner/:repo", async (req, res) => {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      owner: req.params.owner,
      repo: req.params.repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    res.json({ id: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/repo/:owner/:repo/contributors", async (req, res) => {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contributors",
      {
        owner: req.params.owner,
        repo: req.params.repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:username/repos", async (req, res) => {
  try {
    let page = 1;
    let allRepos = [];
    let languageCount = {};

    const userDetails = await octokit.request("GET /users/{username}", {
      username: req.params.username,
    });

    while (true) {
      const reposResponse = await octokit.request(
        "GET /users/{username}/repos",
        {
          username: req.params.username,
          page: page,
          per_page: 100,
        }
      );

      if (reposResponse.data.length === 0) {
        break;
      }

      allRepos = allRepos.concat(reposResponse.data);
      page++;
    }

    const reposWithLanguagesAndContributors = await Promise.all(
      allRepos.map(async (repo) => {
        const languagesResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/languages",
          {
            owner: repo.owner.login,
            repo: repo.name,
          }
        );

        let languages = languagesResponse.data
          ? Object.keys(languagesResponse.data)
          : [];

        languages.forEach((lang) => {
          if (languageCount[lang]) {
            languageCount[lang] += 1;
          } else {
            languageCount[lang] = 1;
          }
        });

        let contributors = [];
        try {
          const contributorsResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/contributors",
            {
              owner: repo.owner.login,
              repo: repo.name,
              per_page: 10,
            }
          );

          if (contributorsResponse.data) {
            contributors = contributorsResponse.data.map((contributor) => ({
              name: contributor.login,
              profile_url: contributor.avatar_url,
            }));
          }
        } catch (err) {
          console.error(
            `Error fetching contributors for repo ${repo.name}: ${err.message}`
          );
        }

        return {
          id: repo.id,
          name: repo.name,
          visibility: repo.visibility,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          watchers_count: repo.watchers_count,
          languages: languages,
          contributors: contributors,
          has_issues: repo.has_issues,
          has_discussions: repo.has_discussions,
          forks_count: repo.forks_count,
          open_issues_count: repo.open_issues_count,
          license: repo.license ? repo.license.name : null,
          default_branch: repo.default_branch,
          owner: {
            login: repo.owner.login,
            id: repo.owner.id,
            avatar_url: repo.owner.avatar_url,
          },
        };
      })
    );
    let totalLanguageRepos = Object.values(languageCount).reduce(
      (a, b) => a + b,
      0
    );
    let languagePercentages = {};
    Object.keys(languageCount).forEach((lang) => {
      languagePercentages[lang] = (
        (languageCount[lang] / totalLanguageRepos) *
        100
      ).toFixed(2);
    });

    reposWithLanguagesAndContributors.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    let mostUsedLanguages = Object.keys(languageCount).sort(
      (a, b) => languageCount[b] - languageCount[a]
    );

    const repoCount = reposWithLanguagesAndContributors.length;
    res.json({
      user: {
        login: userDetails.data.login,
        id: userDetails.data.id,
        avatar_url: userDetails.data.avatar_url,
        bio: userDetails.data.bio,
        languagePercentages: languagePercentages,
        most_used_languages: mostUsedLanguages.slice(0, 5),
      },
      count: repoCount,
      repositories: reposWithLanguagesAndContributors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
