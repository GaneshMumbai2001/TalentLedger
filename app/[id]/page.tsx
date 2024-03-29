"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { setToken } from "@/store/action";
import EditProfileForm from "../Components/EditProfileForm";
import { MdEdit } from "react-icons/md";
import EditExperienceForm from "../Components/EditExperienceForm";
import { toast, ToastContainer } from "react-toastify";
import EditProjectForm from "../Components/EditProjectForm";
import EditSkills from "../Components/EditSkills";
import EditLinkForm from "../Components/EditLinkForm";
import EditAchievementForm from "../Components/EditAchievementForm";
import { AiOutlineDelete } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import myprofile1 from "../../assets/myprofile1.png";
import {
  FaArrowRight,
  FaGithub,
  FaLinkedin,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShareAlt,
  FaTwitter,
} from "react-icons/fa";
import myprofile2 from "../../assets/myprofile2.png";
import myprofile3 from "../../assets/myprofile3.png";
import linkedin from "../../assets/linkedin.png";
import behance from "../../assets/behance.png";
import github from "../../assets/github.png";
import portfolio from "../../assets/portfolio.png";
import blog from "../../assets/medium.png";
import twitter from "../../assets/twitter.png";
import achicon from "../../assets/achicon.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { TbWorld } from "react-icons/tb";
import { MdArrowOutward } from "react-icons/md";
import { PiGithubLogoBold } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { Graph } from "react-github-activity-calendar";
import LanguagePercentageDisplay from "../Components/LanguagePercentageDisplay";
import RepoDetails from "../Components/RepoDetails";
import Particle from "@/app/Components/Particles";

function Page() {
  const [did, setDid] = useState("");
  const [persona, setPersona] = useState<string>();
  const [address, setAddress] = useState("");
  const [resumeHave, setResumeHave] = useState(false);
  const [academicProjects, setAcademicProjects] = useState([]);
  const [personalInformation, setPersonalInformation] = useState({});
  const [workExperiences, setWorkExperiences] = useState([]);
  const [token, settoken] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const githubApiKey = "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";
  const pathSegments = url.pathname.split("/");
  const [balance, setBalance] = useState("");
  const search = pathSegments[pathSegments.length - 1];
  const dispatch = useDispatch();
  const imageMap = {
    linkedin,
    behance,
    github,
    portfolio,
    blog,
    twitter,
  };

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setAddress(await signer.getAddress());
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (address) {
      getUser(address);
    }
  }, [address]);

  const getUser = async (address) => {
    try {
      const postData = {
        address: address,
      };
      const balance = await CheckTokenBalance({ address: address });
      if (balance) {
        const balanceInNo = ethers.utils.formatEther(balance._hex);
        setBalance(balanceInNo);
      }
      const response = await fetch("https://gigshub-v1.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseData = await response.json();
      setDid(ethers.utils.toUtf8String(responseData.did));
      const personatype = responseData.persona;
      setPersona(personatype);
      const token = responseData?.token;
      dispatch(setToken({ token }));
      settoken(responseData?.token);
      await getResume();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const convertStringToDID = (str) => {
    return ethers.utils.formatBytes32String(str);
  };
  useEffect(() => {
    getResume();
  }, []);

  const getResume = async () => {
    try {
      const did = convertStringToDID(search);
      const response = await fetch(
        `https://gigshub-v1.vercel.app/api/get-resume/${did}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      const data = await response.json();
      setAcademicProjects(data.resume.academicProjects);
      setPersonalInformation(data.resume.personalInformation);
      setWorkExperiences(data.resume.workExperiences);
      setSkills(data.resume.skills);
      setAchievements(data.resume.achievements);
      setLinks(data.resume.links);
      setResumeHave(true);
    } catch (error) {
      console.error("An error occurred while fetching the resume:", error);
    }
  };

  const updateProfile = async (updatedInformation) => {
    setPersonalInformation(updatedInformation);
  };

  const updateProject = async (experienceData, index = -1) => {
    let updateProject;

    if (index >= 0) {
      updateProject = [...academicProjects];
      updateProject[index] = experienceData;
    } else {
      updateProject = [...academicProjects, experienceData];
    }

    setAcademicProjects(updateProject);
  };

  const updateExperience = async (experienceData, index = -1) => {
    let updatedExperiences;

    if (index >= 0) {
      updatedExperiences = [...workExperiences];
      updatedExperiences[index] = experienceData;
    } else {
      updatedExperiences = [...workExperiences, experienceData];
    }

    setWorkExperiences(updatedExperiences);
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = workExperiences.filter(
      (_, idx) => idx !== index
    );
    setWorkExperiences(updatedExperiences);
  };
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
  const handleSkillInputChange = (e) => {
    setNewSkill(e.target.value);
  };
  const handleDeleteProject = (index) => {
    const updatedprojects = academicProjects.filter((_, idx) => idx !== index);
    setAcademicProjects(updatedprojects);
  };
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };
  function formatDate(dateString) {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const updateLink = (updatedLink, index) => {
    const updatedLinks = [...links];
    updatedLinks[index] = updatedLink;
    setLinks(updatedLinks);
  };

  const deleteLink = (linkIndex, key) => {
    const updatedLinks = links.map((link, idx) => {
      if (idx === linkIndex) {
        const { [key]: _, ...rest } = link;
        return rest;
      }
      return link;
    });

    setLinks(updatedLinks);
  };

  const updateAchievement = (updatedAchievement, index) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = updatedAchievement;
    setAchievements(updatedAchievements);
  };

  const [editingLinkIndex, setEditingLinkIndex] = useState(-1);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(-1);

  const openEditLinkModal = (index) => {
    setEditingLinkIndex(index);
  };

  const openEditAchievementModal = (index) => {
    setEditingAchievementIndex(index);
  };

  const saveEditedLink = (editedLink) => {
    const updatedLinks = [...links];
    updatedLinks[editingLinkIndex] = editedLink;
    setLinks(updatedLinks);
    setEditingLinkIndex(-1);
  };

  const saveEditedAchievement = (editedAchievement) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[editingAchievementIndex] = editedAchievement;
    setAchievements(updatedAchievements);
    setEditingAchievementIndex(-1);
  };

  const deleteAchievement = (index) => {
    const updatedAchievements = achievements.filter((_, idx) => idx !== index);
    setAchievements(updatedAchievements);
  };

  function calculateDuration(startDate, endDate) {
    if (!startDate) return "NaN months";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (isNaN(start.getTime()) || (endDate && isNaN(end.getTime()))) {
      return "NaN months";
    }

    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth();
    return diffInMonths <= 1
      ? `${diffInMonths} month`
      : `${diffInMonths} months`;
  }
  const handleResumeClick = () => {
    if (!personalInformation.filehash) {
      toast.error("No resume is being uploaded");
    } else {
      window.open(
        `https://gateway.pinata.cloud/ipfs/${personalInformation.filehash}`,
        "_blank"
      );
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    const updatedResumeData = {
      personalInformation,
      workExperiences,
      academicProjects,
      links,
      skills,
      achievements,
    };

    try {
      const response = await fetch(
        "https://gigshub-v1.vercel.app/api/modify-resume",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedResumeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const openEditSkillsForm = () => setIsEditSkillsOpen(true);
  const closeEditSkillsForm = () => setIsEditSkillsOpen(false);
  const updateSkills = (updatedSkills) => {
    setSkills(updatedSkills);
  };

  const openEditProfileForm = () => setIsEditProfileOpen(true);
  const closeEditProfileForm = () => setIsEditProfileOpen(false);
  const openAddExperienceForm = () => setIsEditExperienceOpen(true);
  const openProjectForm = () => setIsProjectOpen(true);
  const closeProjectForm = () => setIsProjectOpen(false);
  const closeAddExperienceForm = () => setIsEditExperienceOpen(false);
  const shareURL = `https://gigshub.xyz/${search}`;
  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Share Gigshub",
          text: "Check out this awesome website!",
          url: shareURL,
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [error, setError] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const fetchRepos = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://gigshub-v1.vercel.app/api/user/${username}/repos`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setRepos(data.repositories);

      if (data.repositories.length > 0) {
        setOwnerInfo({
          login: data.user.login,
          avatar_url: data.user.avatar_url,
          bio: data.user.bio,
          languagePercentages: data.user.languagePercentages,
          most_used_languages: data.user.most_used_languages.join(", "),
        });
      } else {
        setOwnerInfo(null);
      }
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const username = links[0]?.github.slice(19);
    fetchRepos(username);
  }, [links[0]?.github]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
  };
  const handleBack = () => {
    setSelectedRepo(null);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRepoId, setSelectedRepoId] = useState(null);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRepoDetails = (repoId) => {
    if (selectedRepoId === repoId) {
      setSelectedRepoId(null);
    } else {
      setSelectedRepoId(repoId);
    }
  };

  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [buttonText, setButtonText] = useState("View More");

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
    setButtonText(isDetailsVisible ? "View More" : "View Card");
  };

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10 ">
      <Navbar did={did} persona={persona} balance={balance} />
      <div className="mt-10  text-white">
        {resumeHave && (
          <div>
            <div className="flex lg:flex-row items-center justify-center pb-10 md:items-start flex-col lg:mx-7 md:mx-5 2xl:mx-10">
              <div className="bg-[url('../assets/profilecard.png')] mx-5 my-5 mb-20 md:mb-0 rounded-2xl bg-cover bg-no-repeat h-[500px] md:h-[540px] border-4 border-black md:w-[380px] px-4 md:mr-5  2xl:mr-10   ">
                <div className="flex flex-col items-center ">
                  <div className="bg-[#161F2D]   text-white text-xl mt-4 rounded-lg  items-center space-x-3  flex justify-between py-1 px-4">
                    <div>
                      <p className="text-lg ">
                        {personalInformation.designation}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a href={links[0]?.twitter} target="_blank">
                        {" "}
                        <FaTwitter />
                      </a>
                      <a href={links[0]?.linkedin} target="_blank">
                        <FaLinkedin />
                      </a>
                      <a href={links[0]?.github} target="_blank">
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                  <div>
                    <img
                      src={personalInformation.profileImage}
                      alt="Profile"
                      className=" md:w-64 md:h-[220px] w-40 h-auto  border-black border-x-4    "
                    />
                  </div>
                  <div className="bg-[#161F2D] absolute mt-[190px] sm:mt-[180px] md:mt-[250px]  2xl:mt-[250px]  px-2 py-2 border-4 inline-block rounded-2xl border-[#121212]">
                    <p className=" flex text-sm">
                      <FaRegStar className="mt-1 mx-1 " />{" "}
                      {personalInformation.name} {personalInformation.lastName}
                    </p>
                  </div>
                  <div className="bg-[#161F2D] rounded-xl px-4 pb-3 pt-3">
                    <p className="text-[10px] font-serif mt-3 text-[#B0B0B0]">
                      //About Me
                    </p>
                    <p className="text-sm">
                      {personalInformation.bio &&
                        `{( ${personalInformation.bio} )}`}
                    </p>
                    <p className="text-[10px] font-serif mt-3 text-[#B0B0B0]">
                      //Skills{" "}
                    </p>
                    <div className="flex flex-wrap text-sm  space-x-2">
                      {skills && `{(`}
                      {skills.map((skill, index) => (
                        <p key={index} className="">
                          {index > 0 && " ● "}
                          {skill}
                        </p>
                      ))}
                      {skills && `  )}`}
                    </div>
                    <p className="text-[10px] font-serif mt-3 text-[#B0B0B0]">
                      //github
                    </p>
                    <p className="text-sm">@{links[0]?.github.slice(19)}</p>
                  </div>
                  <div className="text-black cursor-pointer text-xl px-2 py-2 rounded-full bg-white">
                    <FaShareAlt onClick={handleShareClick} />
                  </div>
                  <button
                    onClick={toggleDetails}
                    className="mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
              {isDetailsVisible && (
                <div className=" border-2 px-2 md:px-10 rounded-lg py-10 mx-6 my-2 border-white">
                  <div className="flex md:flex-row flex-col items-center  md:space-x-5 2xl:space-x-12">
                    <div>
                      <div className="profilecardd w-[320px] 2xl:w-[350px] rounded-lg px-3 py-5">
                        <div className="px-5 flex font-serif justify-between items-center text-black text-lg ">
                          <p>Check my</p>
                          <TbWorld className="w-12 h-12" />
                        </div>
                        <div>
                          <a
                            className="px-5 flex space-x-1   items-center text-black  font-semibold text-3xl "
                            href={links[0]?.portfolio}
                            target="_blank"
                          >
                            {" "}
                            <p className=" underline">PORTFOLIO</p>
                            <MdArrowOutward className="w-8 h-8" />
                          </a>
                        </div>
                      </div>
                      <div className="profilecardd md:w-[320px] 2xl:w-[350px] mt-3 rounded-lg px-3 py-5">
                        <div className="px-5 flex font-serif justify-between items-center text-black text-lg ">
                          <p>My works</p>
                          <PiGithubLogoBold className="w-12 h-12" />
                        </div>
                        <div>
                          <a
                            className="px-5 flex space-x-1  items-center text-black  font-semibold text-3xl "
                            href={links[0]?.github}
                            target="_blank"
                          >
                            {" "}
                            <p className=" underline">GITHUB</p>
                            <MdArrowOutward className="w-8 h-8" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-3 md:mt-0 items-center">
                      <div>
                        <img
                          src={`https://github-readme-stats.vercel.app/api?username=${links[0]?.github.slice(
                            19
                          )}&show_icons=true&theme=react&count_private=true&include_all_commits=true`}
                          alt="Vairamuthu M"
                          align="right"
                        />
                      </div>
                      <div className="bg-[#BBE5FF] text-lg underline text-black px-4 py-2 mt-3 rounded-lg">
                        <a
                          href={`mailto:${personalInformation.email}`}
                          target="_blank"
                        >
                          {" "}
                          <p className="flex ">
                            <CiMail className="w-8 h-8 mr-2 bg-[#F1624D] px-2 py-1 rounded-full " />
                            {personalInformation.email}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col items-center md:space-x-5 2xl:space-x-12">
                    <div className="mt-3">
                      <LanguagePercentageDisplay
                        languagePercentages={ownerInfo?.languagePercentages}
                      />
                    </div>
                    <div className="w-[320px] mt-3 md:mt-0 md:w-[500px] ">
                      {links[0]?.github && (
                        <Graph
                          userName={links[0].github.slice(19)}
                          backgroundColor="#3498DB"
                          githubApiKey={githubApiKey}
                          color="white"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col items-center md:space-x-5 2xl:space-x-12  mt-5">
                    <div>
                      <p className="text-gray-100  font-semibold mb-2">
                        Total Repositories: {filteredRepos.length}
                      </p>
                      <div
                        className="bg-[#171717] w-[320px] 2xl:w-[350px] rounded-xl shadow-md overflow-y-auto"
                        style={{ maxHeight: "300px" }}
                      >
                        <div style={{ padding: "10px" }}>
                          {filteredRepos.map((repo) => (
                            <div key={repo.id}>
                              <div
                                onClick={() => toggleRepoDetails(repo.id)}
                                className="cursor-pointer p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <p className="text-white">{repo.name}</p>
                                {selectedRepoId === repo.id ? (
                                  <FaMinus />
                                ) : (
                                  <FaPlus />
                                )}
                              </div>
                              {selectedRepoId === repo.id && (
                                <RepoDetails repo={repo} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mt-3 md:mt-0">Work Experiences</p>
                      <div className=" flex md:space-x-10 mt-5   flex-wrap  md:flex-row justify-center flex-col">
                        {workExperiences.map((experience, index) => (
                          <div
                            key={index}
                            className="flex  mb-5 repocard md:w-full   w-[320px] rounded-lg px-5 py-10"
                          >
                            <div>
                              <p className="text-black text-xl md:text-2xl md:mx-0 mx-5 font-bold">
                                {experience.designation}{" "}
                                <span className="text-[#3498DB] mt-2 font-thin">
                                  {" "}
                                  •{" "}
                                </span>
                                <span className="text-sm font-light">
                                  {formatDate(experience.startDate)} -
                                  {new Date(experience.endDate) > new Date()
                                    ? "Present"
                                    : formatDate(experience.endDate)}
                                  (
                                  {calculateDuration(
                                    experience.startDate,
                                    experience.endDate
                                  )}
                                  )
                                </span>
                              </p>

                              <p className="text-black">
                                {experience.organisation}, {experience.location}
                              </p>
                              <p className="text-black md:w-[400px]">
                                {experience.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
