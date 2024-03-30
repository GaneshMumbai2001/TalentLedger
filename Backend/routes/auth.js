const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const { Octokit } = require("@octokit/core");

const abi = require("../helpers/did.json");

router.post("/signup", async (req, res) => {
  const { address, role, ipfsHash } = req.body;

  try {
    const existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }
    const newUser = await User.create({
      address: address,
      role: role,
      ipfsHash: ipfsHash,
    });

    res.status(200).json({ message: "Registration successful!", token });
  } catch (error) {
    console.error(error);
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
