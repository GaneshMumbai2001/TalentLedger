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
import { FaArrowRight } from "react-icons/fa";
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
import Particle from "../Components/Particles";
import { useRouter } from "next/navigation";
import { CheckTokenBalance } from "@/config/BlockchainServices";

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
  const [balance, setBalance] = useState("");
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
      await getResume(responseData.did, responseData?.token);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const getResume = async (did, token) => {
    try {
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
  const router = useRouter();
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
      router.push("/MyProfile");
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

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10 ">
      {/* <Particle /> */}
      <Navbar did={did} persona={persona} balance={balance} />
      <div className="mt-10  text-white">
        <div className="flex justify-center ">
          <p className="text-4xl text-center md:absolute  mt-5 font-bold">
            On-Chain Resume
          </p>
        </div>
        <div className="flex  justify-between">
          <Image
            src={myprofile2}
            alt=""
            className="hidden md:block h-24 w-auto"
          />
          <Image
            src={myprofile1}
            alt=""
            className=" hidden md:block ml-14 md:ml-0 md:mr-24"
          />
          <div></div>
        </div>

        {resumeHave && (
          <div>
            <div className="flex md:flex-row flex-col-reverse bgprofile justify-between mx-5 px-10 py-5 md:mx-40 mt-5 md:mt-20">
              <div className="flex  items-center space-x-3">
                <div>
                  <p className="text-[#3498DB] text-xl md:text-3xl font-bold">
                    {personalInformation.name} {personalInformation.lastName}
                  </p>
                  <p className="text-white text-lg font-bold">
                    {personalInformation.designation}
                  </p>
                  <p className="text-white">{personalInformation.email}</p>
                  <p className="mt-2 md:w-[600px] text-white">
                    {personalInformation.bio}
                  </p>
                  <div className="flex flex-wrap  my-3  gap-2 ">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex border border-white bg-[#3498DB] text-white px-3 py-1 rounded-lg"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-gray-100 ml-2"
                        >
                          &#x2715;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <div className="flex items-center flex-col">
                  <button
                    className=" mt-2 px-6 py-1 rounded-lg space-x-3 flex"
                    onClick={openEditProfileForm}
                  >
                    <MdEdit className="mt-1" /> Edit Bio
                  </button>
                  <img
                    src={personalInformation.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mt-4"
                  />
                  <button
                    className="bg-green-500 px-6 py-1 mt-1 rounded-lg"
                    onClick={handleResumeClick}
                  >
                    Resume
                  </button>

                  <button
                    onClick={openEditSkillsForm}
                    className="mt-2 px-6 py-1 rounded-lg space-x-3 flex"
                  >
                    <MdEdit className="mt-1" /> Edit Skills
                  </button>
                </div>
                <ToastContainer />
              </div>
            </div>
            <p className="text-center text-3xl font-bold mt-16">
              Let’s Connect Now!!
            </p>
            {links.map((link, linkIndex) => (
              <>
                <div className="flex md:flex-row  flex-col mx-5 md:mx-40 my-10  items-center">
                  <p className="text-[#3498DB] text-2xl md:text-4xl font-bold"></p>
                  <div
                    className="flex mt-2 justify-center  flex-wrap"
                    key={linkIndex}
                  >
                    {Object.entries(link).map(([key, value], index) => (
                      <div
                        className="flex  space-x-2    md:space-x-4 md:mx-5 justify-between items-center "
                        key={index}
                      >
                        <div className="md:flex-row items-center  mb-8 flex space-x-2">
                          <div>
                            <Image
                              src={imageMap[key]}
                              alt=""
                              className="md:w-12 h-6 w-6 md:h-12"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div>
                            <p>{key}:</p>
                            {/* <p className='text-[#3498DB] text-sm md:text-base lg:text-lg break-words'> {value}</p> */}
                            {/* Alternatively, for handling overflow with ellipsis */}
                            <p className="text-[#3498DB] text-sm md:text-base lg:text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
                              {" "}
                              {value}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => deleteLink(linkIndex, key)}>
                          <AiOutlineDelete className="text-white text-xl" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className=" mt-2 px-6 py-1 rounded-lg space-x-3 flex"
                    onClick={() => openEditLinkModal(linkIndex)}
                  >
                    <MdEdit className="mt-1" /> Edit
                  </button>
                </div>
              </>
            ))}

            <div className="mx-5 md:mx-32 mt-5  ">
              {isProjectOpen && (
                <EditProjectForm
                  academicProjects={academicProjects}
                  closeForm={closeProjectForm}
                  updateProject={updateProject}
                />
              )}

              <p className="text-[#3498DB] text-3xl font-bold">
                Personal Projects
              </p>

              <br />
              <div className=" flex md:space-x-10  flex-wrap  md:flex-row justify-center flex-col">
                {academicProjects.map((project, index) => (
                  <div key={index} className="flex  mb-5 bgprofile px-5 py-10 ">
                    <div className="">
                      <p className="text-white text-xl md:text-2xl font-bold">
                        {project.title}
                      </p>
                      <p className="text-white">
                        {project.startMonth} - {project.endMonth}
                      </p>
                      <p className="text-[#3498DB]">{project.projectLink}</p>
                      <p className="text-white md:w-[400px]">
                        {project.description}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteProject(index)}>
                      <AiOutlineDelete className="text-white text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="flex bg-[#3498DB] text-white p-2 rounded mt-3"
                onClick={openProjectForm}
              >
                <AiOutlinePlus className="mt-1" /> Add Projects
              </button>
            </div>
            <div className="mx-5 md:mx-32 mt-5   ">
              {isEditProfileOpen && (
                <EditProfileForm
                  personalInformation={personalInformation}
                  closeForm={closeEditProfileForm}
                  updateProfile={updateProfile}
                />
              )}
              <div className="">
                <p className="text-[#3498DB] text-3xl font-bold">
                  Work Experience
                </p>
              </div>
              <div className=" flex md:space-x-10 mt-5  flex-wrap  md:flex-row justify-center flex-col">
                {workExperiences.map((experience, index) => (
                  <div key={index} className="flex  mb-5 bgprofile px-5 py-10">
                    <div>
                      <p className="text-white text-xl md:text-2xl md:mx-0 mx-5 font-bold">
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

                      <p className="text-white">
                        {experience.organisation}, {experience.location}
                      </p>
                      <p className="text-white md:w-[400px]">
                        {experience.description}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteExperience(index)}>
                      <AiOutlineDelete className="text-white text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="flex bg-[#3498DB] text-white p-2 rounded mt-3"
                onClick={openAddExperienceForm}
              >
                <AiOutlinePlus className="mt-1" /> Add Experience
              </button>
            </div>

            <div className="flex  md:pt-2 items-center justify-center">
              <div className="flex  mt-5">
                <div className="flex flex-col text-sm text-[#FFF] font-light space-y-1">
                  {isEditSkillsOpen && (
                    <EditSkills
                      skills={skills}
                      updateSkills={updateSkills}
                      closeForm={closeEditSkillsForm}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="md:mx-32 mx-5 text-center mt-5">
              {achievements.map((achievement, index) => (
                <div key={index} className="mt-2">
                  {index === 0 && (
                    <p className="text-[#3498DB] text-left text-2xl md:text-4xl font-bold mb-2">
                      Achievements
                    </p>
                  )}

                  <div className="flex items-center space-x-8 mx-5 md:space-x-0 md:mx-0 justify-between">
                    <div className="flex mt-4 space-x-2 md:space-x-5">
                      <Image src={achicon} alt="" className="h-5 w-auto" />{" "}
                      <p>{achievement}</p>
                    </div>
                    <div className="flex">
                      <button
                        className=" mt-2 px-6 py-1 rounded-lg space-x-3 flex"
                        onClick={() => openEditAchievementModal(index)}
                      >
                        <MdEdit className="mt-1" /> Edit
                      </button>

                      <button onClick={() => deleteAchievement(index)}>
                        <AiOutlineDelete className="text-white mt-2 text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingLinkIndex >= 0 && (
              <EditLinkForm
                link={links[editingLinkIndex]}
                onSave={saveEditedLink}
                onClose={() => setEditingLinkIndex(-1)}
              />
            )}

            {editingAchievementIndex >= 0 && (
              <EditAchievementForm
                achievement={achievements[editingAchievementIndex]}
                onSave={saveEditedAchievement}
                onClose={() => setEditingAchievementIndex(-1)}
              />
            )}

            {isEditExperienceOpen && (
              <EditExperienceForm
                closeForm={closeAddExperienceForm}
                updateExperience={updateExperience}
              />
            )}
            <button
              onClick={saveChanges}
              disabled={isLoading}
              className="flex mx-auto mt-10 px-7 bg-[#3498DB] text-white p-2 rounded-lg  "
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  <p className="flex space-x-4">
                    Update <FaArrowRight className="mt-1" />{" "}
                  </p>
                </>
              )}
            </button>
            <ToastContainer />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
