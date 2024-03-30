"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  AiOutlinePlus,
  AiOutlineArrowRight,
  AiFillDelete,
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import Image from "next/image";
import Hero from "../../assets/Hero.png";
import Navbar from "../Components/Navbar";
import { useRouter } from "next/navigation";
import { ProgressBar } from "../Components/ProgressBar";
import logo from "../../assets/logo2.png";
import role1 from "../../assets/person.svg";
import role2 from "../../assets/work.svg";
import cloud from "../../assets/cloud.svg";
import file from "../../assets/file.svg";
import { uploadJSONToPinata, uploadFileToPinata } from "../../config/pintoIPFS";
import {
  Onboard,
  RetreiveByAddress,
  checkOnboarded,
  createdid,
} from "@/config/BlockchainServices";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { OpenAI } from "langchain/llms/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { LuUploadCloud } from "react-icons/lu";
import { setEmailtostore } from "@/store/action";
import Particle from "../Components/Particles";
import Celebration from "../../assets/celebration.png";
import { setToken } from "@/store/action";
import { RootState } from "@/store/store";
import ProctedNav from "../Components/ProctedNav";
import OnboardingNav from "../Components/OnboardingNav";
import { NewprogressBar } from "../Components/NewprogressBar";
import { FaPlus } from "react-icons/fa";
import bs58 from "bs58";

function Page() {
  const [name, setName] = useState("");
  const [did2, setId] = useState("");
  const [Providername, setProvidername] = useState("");
  const [lastName, setLastName] = useState("");
  const [Providerlastname, setProviderlastname] = useState("");
  const [Provideremail, setProvideremail] = useState("");
  const [Providertwitter, setProvidertwitter] = useState("");
  const [Providerdiscord, setProviderdiscord] = useState("");
  const [email, setEmail] = useState("");
  const [designation, SetDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [istriggered, setIstriggered] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([
    {
      id: 1,
      organisation: "",
      startDate: "",
      endDate: "",
      designation: "",
      location: "",
      description: "",
    },
  ]);

  const [academicProjects, setAcademicProjects] = useState([
    {
      id: 1,
      title: "",
      startMonth: "",
      endMonth: "",
      description: "",
      projectLink: "",
    },
  ]);

  const [links, setLinks] = useState([
    {
      id: 1,
      portfolio: "",
      twitter: "",
      linkedin: "",
      behance: "",
      github: "",
      blog: "",
    },
  ]);

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        id: workExperiences.length + 1,
        organisation: "",
        startDate: "",
        endDate: "",
        designation: "",
        location: "",
        description: "",
      },
    ]);
  };

  const addAcademicProject = () => {
    setAcademicProjects([
      ...academicProjects,
      {
        id: academicProjects.length + 1,
        title: "",
        startMonth: "",
        endMonth: "",
        description: "",
        projectLink: "",
      },
    ]);
  };
  const addLinks = () => {
    setLinks([
      ...links,
      {
        id: links.length + 1,
        portfolio: "",
        twitter: "",
        linkedin: "",
        behance: "",
        github: "",
        blog: "",
      },
    ]);
  };

  const deleteWorkExperience = (id) => {
    setWorkExperiences(
      workExperiences.filter((experience) => experience.id !== id)
    );
  };

  const deleteAcademicProject = (id) => {
    setAcademicProjects(
      academicProjects.filter((project) => project.id !== id)
    );
  };
  const deleteLinks = (id) => {
    setLinks(links.filter((project) => project.id !== id));
  };
  const handleAcademicProjectChange = (e, id, field) => {
    const newAcademicProjects = academicProjects.map((project) => {
      if (project.id === id) {
        return { ...project, [field]: e.target.value };
      }
      return project;
    });
    setAcademicProjects(newAcademicProjects);
  };
  const handleWorkExperienceChange = (e, id, field) => {
    const newWorkExperiences = workExperiences.map((experience) => {
      if (experience.id === id) {
        return { ...experience, [field]: e.target.value };
      }
      return experience;
    });
    setWorkExperiences(newWorkExperiences);
  };

  const handleLinks = (e, id, field) => {
    const newlinks = links.map((link) => {
      if (link.id === id) {
        return { ...link, [field]: e.target.value };
      }
      return link;
    });
    setLinks(newlinks);
  };
  const [selectedRole, setSelectedRole] = useState();

  async function handleRoleSelect(role: any) {
    setSelectedRole(role);
  }

  const getOpacityClass = (role) => {
    return selectedRole === role
      ? "border-[#009DB5] border-2"
      : "hover:border-[#009DB5] border-2";
  };

  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [entergig, setEnterGigs] = useState("");
  const [timeline, settimeline] = useState("");
  const [pay, setPay] = useState("");
  const [gigskills, setgigskills] = useState("");
  const [gigsummary, setsummary] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const llm = new OpenAI({
    openAIApiKey: "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",
  });

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAWPTkvm5tFvKgv2S_w-Sw2MJPV-_Qakg8"
  );

  async function run(docs: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = ` ${docs} from this resume content 
     1.fetch the first name,last name, email , designation, known programming language.
    2. fetch work experience in the format of company name, designation, description, location,  start date and end date.
    3. projects in the format of project name, description, project started date, project ended date and programming stacks used. 
    4. make a description of a candidate with the resume content
    5. fetch the achievements
    6. fetch their linkedIn profile link
    7. fetch their github profile link
    8. fetch their portfolio link
    9. fetch their behance link
    10 .fetch their blog link
    11. fetch their twitter link
return all these data in json format with exact lables such as firstName, lastName,email,designation,programmingLanguages, description, workExperience, projects, achievements, linkedIn, github, behance, blog, portfolio, twitter


which i can simply parse it as json.
    So the response shouldn't contain anything  other than the json. 
    I only need the information I asked and ignore the rest.  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonFormat = text.replace(/```/g, "");
    const jsonFormatt = jsonFormat.replace(/json/g, "");
    const jsondata = JSON.parse(jsonFormatt);
    setName(jsondata.firstName);
    setLastName(jsondata.lastName);
    setEmail(jsondata.email);
    const responses = jsondata.projects;
    const updatedProjects = responses.map((project, index) => ({
      id: index + 1,
      title: project.projectName || project.name,
      startMonth: project.startDate,
      endMonth: project.endDate,
      description: project.description,
      projectLink: "",
    }));

    setAcademicProjects(updatedProjects);

    const achievementsRes = jsondata.achievements;

    setAchievements(achievementsRes);

    const lang = jsondata.programmingLanguages;

    setSkills(lang);

    const git = jsondata.github;

    const linkedIn = jsondata.linkedIn;

    const portfolio = jsondata.portfolio;
    const blog = jsondata.blog;

    const behance = jsondata.behance;

    const twitter = jsondata.twitter;

    const updatedLinks = {
      id: 1,
      portfolio: portfolio || "",
      twitter: twitter || "",
      linkedin: linkedIn || "",
      behance: behance || "",
      github: git || "",
      blog: blog || "",
    };

    setLinks([updatedLinks]);

    const workRes = jsondata.workExperience;

    try {
      if (workRes > 0) {
        const updatedWorkExperiences = workRes.map((experience, index) => ({
          id: index + 1,
          organisation: experience.companyName || "",
          startDate: experience.startDate || "",
          endDate: experience.endDate || "",
          designation: experience.designation || "",
          location: experience.location || "",
          description: experience.description || "",
        }));
        setWorkExperiences(updatedWorkExperiences);
      }
    } catch {
      console.error("no work experience");
    }

    setIsUploading(false);
  }

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFileSelection(acceptedFiles[0]);
    },
  });
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadFile, setUploadFile] = useState("");
  const handleFileSelection = async (file) => {
    let progressInterval;
    setUploadFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const totalDurationInSeconds = 60;
      const updateIntervalInSeconds = 1;
      const updatesCount = totalDurationInSeconds / updateIntervalInSeconds;
      const progressIncrement = 100 / updatesCount;
      progressInterval = setInterval(() => {
        setUploadProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + progressIncrement, 100);
          if (newProgress >= 100) clearInterval(progressInterval);
          return newProgress;
        });
      }, updateIntervalInSeconds * 1000);
      const blob = new Blob([file], { type: "application/pdf" });
      const loader = new WebPDFLoader(blob, { splitPages: false });
      const docs = await loader.load();
      const val = docs[0].pageContent;
      await Promise.all([
        run(val),
        uploadFileToPinata(file).then((filehash) => {
          setSelectedFile(filehash);
        }),
      ]);
      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error during file selection:", error);
      clearInterval(progressInterval);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const addAch = () => {
    if (newAchievement && !achievements.includes(newAchievement)) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement("");
    }
  };
  const [suggestedSkills, setSuggestedSkills] = useState([
    "HTML",
    "CSS",
    "Adobe Photoshop",
    "Angular",
  ]);
  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setgigskills(gigskills ? `${gigskills}, ${skill}` : skill);
    }
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
  const removeAch = (achToRemove) => {
    setAchievements(
      achievements.filter((achievement) => achievement !== achToRemove)
    );
  };

  const handleSkillInputChange = (e) => {
    setNewSkill(e.target.value);
  };
  const handleAchInputChange = (e) => {
    setNewAchievement(e.target.value);
  };

  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");
  const [persona, setPersona] = useState<string>();
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== undefined) {
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Provider.getSigner();
        const address = await signer.getAddress();
        // const did = await RetreiveByAddress({ address });
        // setDid(did);
        setAddress(address);
      }
    }
    initialize();
  }, []);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const dispatch = useDispatch();
  const [ipfsHash, setipfshash] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setEmailtostore(email));

    try {
      const pinataResponse = await pinJSONToIPFS();
      console.log("Pinata Response:", pinataResponse.IpfsHash);
      // setipfshash();
      const ipfsHash = pinataResponse.IpfsHash;
      console.log("Decoding IPFS hash:", ipfsHash);
      // Proceed to decode the hash here

      console.log("did", { address, selectedRole, ipfsHash });
      if (selectedRole == "Provider") {
        const role = 0;
        await createdid({ address, role, ipfsHash });
        toast.success("Happy to Onboard to our platform!");
        router.push("/Dashboard");
      } else {
        const role = 1;
        await createdid({ address, role, ipfsHash });
        toast.success("Happy to Onboard to our platform!");
        router.push("/FreelancerDashboard");
      }

      if (step < 6) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function pinJSONToIPFS() {
    if (selectedRole == "Developer") {
      const pinataContent = {
        name: name,
        lastName: lastName,
        email: email,
        skills: skills,
        links: links,
        workExperiences: workExperiences,
        designation: designation,
        description: bio,
        profileImage: profileImage,
        achievements: achievements,
      };
      const options = {
        method: "POST",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Y2FiZTdkYS1hMTliLTQxMmYtOWQ2OS1mYjAyZGU3NzFmZWMiLCJlbWFpbCI6Im12YWlyYW11dGh1MjAwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjQyMTczZTNiYTAyM2IwM2Y5NjAiLCJzY29wZWRLZXlTZWNyZXQiOiIyMTZhMWNjNjYxMTcyOWExMTI4MDk1YzdhMGNlYzU2ZTllMWUyYzQzZjk4ZDk2YjUzMzI2MmE1Y2Q1ZDU1OThmIiwiaWF0IjoxNzExNzE3NDYzfQ.Aw5Qw9NLtZnTnUhSiPXKWrkRR1bUY9HzHCxeOdgAxPM",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataContent: pinataContent,
          pinataMetadata: {
            name: "pinnie.json",
          },
          pinataOptions: {
            cidVersion: 1,
          },
        }),
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        options
      );
      if (!response.ok) throw new Error("Failed to pin JSON to IPFS");
      return response.json();
    } else {
      const pinataContent = {
        role: selectedRole,
        Providername: Providername,
        Providerlastname: Providerlastname,
        Provideremail: Provideremail,
        Providertwitter: Providertwitter,
        Providerdiscord: Providerdiscord,
        entergig: entergig,
        timeline: timeline,
        pay: pay,
        gigskills: gigskills,
        gigsummary: gigsummary,
      };
      const options = {
        method: "POST",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Y2FiZTdkYS1hMTliLTQxMmYtOWQ2OS1mYjAyZGU3NzFmZWMiLCJlbWFpbCI6Im12YWlyYW11dGh1MjAwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjQyMTczZTNiYTAyM2IwM2Y5NjAiLCJzY29wZWRLZXlTZWNyZXQiOiIyMTZhMWNjNjYxMTcyOWExMTI4MDk1YzdhMGNlYzU2ZTllMWUyYzQzZjk4ZDk2YjUzMzI2MmE1Y2Q1ZDU1OThmIiwiaWF0IjoxNzExNzE3NDYzfQ.Aw5Qw9NLtZnTnUhSiPXKWrkRR1bUY9HzHCxeOdgAxPM",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataContent: pinataContent,
          pinataMetadata: {
            name: "pinnie.json",
          },
          pinataOptions: {
            cidVersion: 1,
          },
        }),
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        options
      );
      if (!response.ok) throw new Error("Failed to pin JSON to IPFS");
      console.log("hash", response.json);
      return response.json();
    }
  }

  async function submitFormData() {
    // Assuming `address` and `selectedRole` are gathered from your application state or inputs
    const userDetails = {
      address: address, // Make sure this is the user's blockchain address
      role: selectedRole, // Ensure this is aligned with the roles defined in your smart contract
      ipfsHash: ipfsHash, // This is the IPFS hash of the user's data
    };
    console.log("userdetails", userDetails);
    const response = await fetch("https://gigshub-v1.vercel.app/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Important for server to correctly parse JSON body
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "User Already Exist!");
    }
    const result = await response.json();
    // Handle the result here, such as updating UI or redirecting the user
  }

  const fileInputRef = useRef(null);
  const [ellipsis, setEllipsis] = useState("");

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setEllipsis("");
    }
  }, [isLoading]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const allFieldsFilled = did;
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRoleSelect(selectedRole);
    }
  };

  return (
    <div className=" bg-[#E2FBFF] bg-cover  bg-no-repeat min-h-screen pb-5 ">
      {/* <Particle/> */}
      <OnboardingNav />
      <div className="md:pl-20">
        <div className="flex mx-4 md:mx-0 justify-center  mb-8">
          <NewprogressBar
            currentStep={step}
            selectedRole={selectedRole}
            // totalSteps={selectedRole == "Provider" ? 2 : 6}
          />
        </div>
        {step === 1 && (
          <>
            <div>
              <div className="w-full px-4">
                <p className="text-center text-black font-bold mt-4 text-2xl md:text-3xl lg:text-4xl">
                  Join as a Gig Provider or Freelancer{" "}
                </p>

                <div className="flex flex-col md:flex-row mt-4  md:mt-5 px-4 md:px-10 space-y-4 md:space-y-0 md:space-x-10 justify-center">
                  <div
                    onClick={() => handleRoleSelect("Provider")}
                    className={` cursor-pointer bg-[#FFFFFF] w-72  hover:bg-[#ffffffb2] rounded-xl py-4 px-8 ${getOpacityClass(
                      "Provider"
                    )}`}
                  >
                    <div className="flex justify-between">
                      <Image
                        src={role1}
                        alt="Developereloper Role"
                        width={35}
                        height={35}
                        className="my-2"
                      />
                      <div>
                        <button
                          className={`ml-4    ${
                            selectedRole === "Provider"
                              ? " border-2 rounded-full border-[#009DB5]"
                              : "border-gray-300"
                          }`}
                        >
                          <p
                            className={`  ${
                              selectedRole === "Provider"
                                ? "bg-[#009DB5] rounded-full border-2 w-4 h-4"
                                : " rounded-full border-2 w-4 h-4"
                            } `}
                          ></p>
                        </button>
                      </div>
                    </div>
                    <p className="text-xl text-black my-2 font-bold">
                      I’m a Gig Provider,
                      <br /> hiring for a project{" "}
                    </p>
                  </div>
                  <div
                    onClick={() => handleRoleSelect("Developer")}
                    className={` cursor-pointer bg-[#FFFFFF] w-72  rounded-xl hover:bg-[#ffffffb2] py-4 px-8 ${getOpacityClass(
                      "Developer"
                    )}`}
                  >
                    <div className="flex justify-between">
                      <Image
                        src={role2}
                        alt="GIG Provider Role"
                        width={35}
                        height={35}
                        className="my-2"
                      />
                      <div>
                        <button
                          className={`ml-4    ${
                            selectedRole === "Developer"
                              ? " border-2 rounded-full border-[#009DB5]"
                              : "border-gray-300"
                          }`}
                        >
                          <p
                            className={`  ${
                              selectedRole === "Developer"
                                ? "bg-[#009DB5] rounded-full border-2 w-4 h-4"
                                : " rounded-full border-2 w-4 h-4"
                            } `}
                          ></p>
                        </button>
                      </div>
                    </div>
                    <p className="text-xl text-black my-2 font-bold">
                      I’m a freelancer, <br />
                      looking for work{" "}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center  mt-3 rounded-lg text-center text-black font-bold text-lg">
                  {selectedRole === "Provider" ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="text-lg md:mt-5 px-5 py-2 flex rounded-2xl bg-[#009DB5] "
                    >
                      Apply as Provider
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="text-lg md:mt-5  px-5 py-2 flex rounded-2xl bg-[#009DB5] "
                    >
                      Apply as Freelancer
                    </button>
                  )}
                </div>
                <div className="flex space-x-2 mt-5 text-center font-medium justify-center">
                  <p>Already have an account?</p>
                  <span className="text-[#009DB5] font-semibold underline">
                    Log In
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        {selectedRole === "Provider" && step === 2 && (
          <>
            <div className="  rounded-2xl md:mx-80 mx-7 px-5 md:px-20  ">
              <p className="text-center text-black font-bold text-2xl md:text-4xl">
                Get Your Personal Gig ID Now !{" "}
              </p>
              <p className="text-center mx-2 text-black text-sm md:mx-0 md:text-lg ">
                Unlock the Future of Job Hunting with Your Personalized GIGID
              </p>
              <div className="flex flex-col  items-center space-y-5 py-6 rounded-lg bg-white justify-center mt-5 ">
                <div className="flex items-center space-x-3 mx-16 ">
                  <div>
                    <label className="text-[#747474]">First name *</label>
                    <input
                      value={Providername}
                      onChange={(e) => setProvidername(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-transparent outline-none pl-3 text-black border border-[#DCDCDC] md:w-[250px] w-20 rounded-xl py-2 "
                    />
                  </div>
                  <div>
                    <label className="text-[#747474]">Last name *</label>
                    <input
                      value={Providerlastname}
                      onChange={(e) => setProviderlastname(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-transparent outline-none pl-3 text-black border border-[#DCDCDC] md:w-[250px] w-20 rounded-xl py-2 "
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#747474]">Work email address</label>
                  <br />
                  <input
                    value={Provideremail}
                    onChange={(e) => setProvideremail(e.target.value)}
                    type="email"
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
                <div>
                  <label className="text-[#747474]">Twitter URL</label>
                  <br />
                  <input
                    value={Providertwitter}
                    onChange={(e) => setProvidertwitter(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
                <div>
                  <label className="text-[#747474]">Discord URL</label>
                  <br />
                  <input
                    value={Providerdiscord}
                    onChange={(e) => setProviderdiscord(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(step + 1)}
                className="text-lg md:mt-5 mx-auto px-10 font-semibold py-2 flex items-center rounded-2xl bg-[#009DB5] "
              >
                Next <AiOutlineArrowRight className="mt-2 ml-1" />
              </button>
            </div>
          </>
        )}
        {selectedRole === "Provider" && step === 3 && (
          <>
            <div className="  rounded-2xl md:mx-80 mx-7 px-5 md:px-20  ">
              <div className="flex flex-col  items-center space-y-5 py-6 rounded-lg bg-white justify-center mt-5 ">
                <div>
                  <div>
                    <label className="text-[#747474]">Enter Gigs *</label>
                    <br />
                    <input
                      value={entergig}
                      onChange={(e) => setEnterGigs(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-transparent outline-none pl-3 text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 "
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#747474]">
                    Enter the Timeline (In Months)
                  </label>
                  <br />
                  <input
                    value={timeline}
                    onChange={(e) => settimeline(e.target.value)}
                    type="email"
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
                <div>
                  <label className="text-[#747474]">
                    How much would you pay*
                  </label>
                  <br />
                  <input
                    value={pay}
                    onChange={(e) => setPay(e.target.value)}
                    type="email"
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
                <div>
                  <label className="text-[#747474]">Skills Required*</label>
                  <br />
                  <input
                    value={gigskills}
                    onChange={(e) => setProvideremail(e.target.value)}
                    type="email"
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
                <div className="flex flex-col mt-3">
                  {suggestedSkills.length > 0 && (
                    <label className="text-sm font-medium text-[#747474]">
                      Suggested Skills
                    </label>
                  )}
                  <div className="text-sm mt-3 flex space-x-4">
                    {suggestedSkills.map((gigskills, index) => (
                      <p
                        key={index}
                        onClick={() => handleAddSkill(gigskills)}
                        className="bg-[#DCDCDC] cursor-pointer flex space-x-2 px-3 py-1 rounded-full font-semibold items-center"
                      >
                        <FaPlus className="text-[#00CBA0]" />
                        <span> {gigskills} </span>
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[#747474]">Summary</label>
                  <br />
                  <input
                    value={gigsummary}
                    onChange={(e) => setsummary(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-transparent outline-none text-black border h-32 border-[#DCDCDC] md:w-[520px] w-40 rounded-xl py-2 pl-3"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedRole === "Developer" && step === 2 && (
          <>
            <div className=" flex  px-5 mx-2 text-center rounded-lg  md:px-10 md:mx-40 justify-center">
              <div>
                <p className="text-xl font-bold text-black md:text-4xl">
                  Upload resume and Get Started
                </p>
                <p className="text-lg mt-2 text-black font-semibold">
                  We need to get a sense of your education, experience and
                  skills. It’s quickest to import your information — you can
                  edit it before your profile goes live.{" "}
                </p>

                <div className=" text-gray-200 md:mx-20 res px-5 py-5">
                  <div
                    {...getRootProps()}
                    className="bg-white border-2 flex items-center  mt-5 py-8 justify-between  border-gray-300 rounded-lg border-dashed px-5 text-center"
                  >
                    <input {...getInputProps()} />
                    <Image
                      src={cloud}
                      alt="GIG Provider Role"
                      width={35}
                      height={35}
                      className="w-12"
                    />
                    <div>
                      <p className="text-lg  text-black font-semibold">
                        Select a file or drag and drop here{" "}
                      </p>
                      <p className="text-[#000000] opacity-40">
                        Use a PDF, Word doc, or rich text file – make sure it’s
                        5MB or less
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button className="text-lg md:mt-5 px-3 py-1 flex rounded-lg border-2  border-[#009DB5]  text-[#009DB5]">
                        SELECT FILE
                      </button>
                    </div>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="bg-white flex flex-col justify-center items-center px-5 space-y-3 rounded-lg mt-5 py-3">
                      <div className="flex justify-center items-center w-full ">
                        <Image
                          src={file}
                          alt="GIG Provider Role"
                          width={35}
                          height={35}
                          className="w-8"
                        />
                        <div className="flex-1 px-5">
                          <p className="text-black text-start py-1 opacity-40">
                            Hashed Resume: {selectedFile?.IpfsHash?.slice(0, 5)}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                              className="bg-[#009DB5] h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-black ">
                          {formatBytes(uploadFile?.size)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {selectedRole === "Developer" && step === 3 && (
          <>
            <p className="text-center text-black text-2xl md:text-4xl font-bold">
              Let's get started
            </p>
            <p className="text-center md:text-lg font-semibold mt-2">
              Edit your data to create the perfect representation of your
              professional journey.
            </p>
            <div className="flex flex-col pt-8 items-center justify-center">
              {profileImage && (
                <>
                  <div className="flex  justify-center">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full my-4"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 ">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter your Name*"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Enter your Last Name*"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                />
              </div>
              <div className="flex flex-col my-8 md:flex-row space-y-4 md:space-y-0 md:space-x-6 ">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your EmailID*"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                />

                <input
                  value={designation}
                  onChange={(e) => SetDesignation(e.target.value)}
                  type="text"
                  placeholder="Enter your Designation*"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                />
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-8 ">
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  type="text"
                  placeholder="Tell About Yourself*"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  onClick={handleButtonClick}
                  className="border bg-transparent flex justify-center space-x-3 px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                >
                  <LuUploadCloud className="text-xl mt-1" /> Upload Profile
                  Image
                </button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-center text-black text-2xl md:text-4xl font-bold">
              Work Experience
            </p>
            {workExperiences?.map((experience, index) => (
              <div
                key={experience.id}
                className="flex flex-col pt-8 items-center justify-center"
              >
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Designation</label>
                    <input
                      value={experience.designation}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          e,
                          experience.id,
                          "designation"
                        )
                      }
                      type="text"
                      placeholder="Designation"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Start Date</label>
                    <input
                      value={experience.startDate}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          e,
                          experience.id,
                          "startDate"
                        )
                      }
                      type="date"
                      placeholder="Start Date"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col  text-sm text-black font-light space-y-1">
                    <label>End Date</label>
                    <input
                      value={experience.endDate}
                      onChange={(e) =>
                        handleWorkExperienceChange(e, experience.id, "endDate")
                      }
                      type="date"
                      placeholder="End Date"
                      className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-black text-black outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-2 space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Organization</label>
                    <input
                      value={experience.organisation}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          e,
                          experience.id,
                          "organisation"
                        )
                      }
                      type="text"
                      placeholder="Organization"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Description (Optional)</label>
                    <input
                      value={experience.description}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          e,
                          experience.id,
                          "description"
                        )
                      }
                      placeholder="Description"
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Location</label>
                    <input
                      value={experience.location}
                      onChange={(e) =>
                        handleWorkExperienceChange(e, experience.id, "location")
                      }
                      type="text"
                      placeholder="Location"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                  {index === workExperiences.length - 1 && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={addWorkExperience}
                        className="border choosecard text-sm px-3 md:w-96 rounded-xl mb-5 py-3 md:mt-5 md:mb-2 border-black text-black"
                      >
                        <span className="flex justify-center space-x-2">
                          <AiOutlinePlus className="mt-1" /> Add Work Experience
                        </span>
                      </button>
                      {experience.id > 1 && (
                        <div className="flex items-center">
                          <button
                            onClick={() => deleteWorkExperience(experience.id)}
                            className="text-red-500 text-xl hover:text-red-700 transition duration-150 ease-in-out"
                          >
                            <AiFillDelete className="md:mt-1" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <p className="text-center text-black text-2xl md:text-4xl mt-4 font-bold">
              Add Academics/ Personal Projects
            </p>
            {academicProjects?.map((project, index) => (
              <div
                key={project.id}
                className="flex flex-col md:pt-8 items-center justify-center"
              >
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Title</label>
                    <input
                      value={project.title}
                      onChange={(e) =>
                        handleAcademicProjectChange(e, project.id, "title")
                      }
                      type="text"
                      placeholder="Title"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Start Month</label>
                    <input
                      value={project.startMonth}
                      onChange={(e) =>
                        handleAcademicProjectChange(e, project.id, "startMonth")
                      }
                      type="month"
                      placeholder="Start Month"
                      required
                      className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>End Month</label>
                    <input
                      value={project.endMonth}
                      onChange={(e) =>
                        handleAcademicProjectChange(e, project.id, "endMonth")
                      }
                      type="month"
                      placeholder="End Month"
                      className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-black text-black outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-2 space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Description (Optional)</label>
                    <input
                      value={project.description}
                      onChange={(e) =>
                        handleAcademicProjectChange(
                          e,
                          project.id,
                          "description"
                        )
                      }
                      placeholder="Description"
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Project Link (Optional)</label>
                    <input
                      value={project.projectLink}
                      onChange={(e) =>
                        handleAcademicProjectChange(
                          e,
                          project.id,
                          "projectLink"
                        )
                      }
                      type="url"
                      placeholder="Project Link"
                      className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                    />
                  </div>
                </div>

                <div className=" flex justify-center">
                  <button
                    onClick={addAcademicProject}
                    className="border my-5 choosecard text-sm px-3 md:w-96 rounded-xl mb-5 md:mb-2 py-3 border-black text-black"
                  >
                    <span className="flex justify-center space-x-2">
                      <AiOutlinePlus className="mt-1" /> Add Academic/ Personal
                      Projects
                    </span>
                  </button>
                  {index !== 0 && (
                    <div className="flex items-center">
                      <button
                        onClick={() => deleteAcademicProject(project.id)}
                        className="text-red-500 text-xl hover:text-red-700 transition duration-150 ease-in-out"
                      >
                        <AiFillDelete className="mt-2 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        {step === 5 && (
          <>
            <div className="flex flex-col md:pt-2 items-center justify-center">
              <p className="text-center text-black text-2xl md:text-4xl font-bold">
                Skills
              </p>
              <div className="flex justify-center mt-5">
                <div className="flex flex-col text-sm text-black font-light space-y-1">
                  <label>Add Skills</label>
                  <div className="flex items-center">
                    <input
                      value={newSkill}
                      onChange={handleSkillInputChange}
                      className="md:w-[500px]  outline-none bg-transparent rounded-lg px-3 py-2 border border-gray-200"
                      type="text"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") addSkill();
                      }}
                    />
                    <button
                      className="bg-green-400 px-4 py-2  ml-2 rounded-lg"
                      onClick={addSkill}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap  justify-center gap-2 mt-3">
                {skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="flex   skillint text-black px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-gray-100 ml-2"
                    >
                      &#x2715;{" "}
                      {/* This is the HTML entity for the multiplication sign (x) */}
                    </button>
                  </div>
                ))}
              </div>
              {links?.map((link, index) => (
                <div
                  key={link.id}
                  className="flex flex-col md:pt-8 items-center justify-center"
                >
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Portfolio Link</label>
                      <input
                        value={link.portfolio}
                        onChange={(e) => handleLinks(e, link.id, "portfolio")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Twitter Link </label>
                      <input
                        value={link.twitter}
                        onChange={(e) => handleLinks(e, link.id, "twitter")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Linkedin Link</label>
                      <input
                        value={link.linkedin}
                        onChange={(e) => handleLinks(e, link.id, "linkedin")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Behance Link</label>
                      <input
                        value={link.behance}
                        onChange={(e) => handleLinks(e, link.id, "behance")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-2 md:gap-16">
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Github Link</label>
                      <input
                        value={link.github}
                        onChange={(e) => handleLinks(e, link.id, "github")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                    <div className="flex flex-col text-sm text-black font-light space-y-1">
                      <label>Blog Link </label>
                      <input
                        value={link.blog}
                        onChange={(e) => handleLinks(e, link.id, "blog")}
                        type="url"
                        placeholder="www.google.com"
                        className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-black text-black outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col md:pt-8 items-center justify-center">
                <p className="text-center text-black text-2xl md:text-4xl font-bold">
                  Achievements
                </p>
                <div className="flex justify-center mt-5">
                  <div className="flex flex-col text-sm text-black font-light space-y-1">
                    <label>Add Achievements</label>
                    <div className="flex items-center">
                      <input
                        value={newAchievement}
                        onChange={handleAchInputChange}
                        className="md:w-[500px]  outline-none bg-transparent rounded-lg px-3 py-2 border border-gray-200"
                        type="text"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") addAch();
                        }}
                      />
                      <button
                        className="bg-green-400 px-4 py-2  ml-2 rounded-lg"
                        onClick={addAch}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col justify-center gap-2 mt-3">
                  {achievements?.map((ach, index) => (
                    <div
                      key={index}
                      className="flex  items-center skillint text-black px-3 py-1 rounded-full"
                    >
                      {ach}
                      <button
                        onClick={() => removeAch(ach)}
                        className="text-gray-100 ml-2"
                      >
                        &#x2715;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col mt-5  md:mt-0 justify-center">
          {selectedRole === "Developer" &&
          ((step === 2 && isUploading === false && selectedFile) ||
            (step >= 3 && step < 5)) ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={isLoading}
              className="text-lg md:mt-5 px-12 mx-auto font-semibold py-2   rounded-xl bg-[#009DB5] text-black"
            >
              <span className="flex">
                Next <AiOutlineArrowRight className="mt-2 ml-1" />
              </span>
            </button>
          ) : null}

          {step === 3 && selectedRole == "Provider" && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="text-lg md:mt-5 px-12 mx-auto font-semibold py-2   rounded-xl bg-[#009DB5] text-black"
            >
              {isLoading ? (
                <p>GigSync{ellipsis}</p>
              ) : (
                <>
                  <span className="flex">
                    Next <AiOutlineArrowRight className="mt-2 ml-1" />
                  </span>
                </>
              )}
            </button>
          )}
          {step === 5 && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="text-lg md:mt-5 px-12 mx-auto font-semibold py-2   rounded-xl bg-[#009DB5] text-black"
            >
              {isLoading ? (
                <p>GigMatch{ellipsis}</p>
              ) : (
                <>
                  <span className="flex">
                    Next <AiOutlineArrowRight className="mt-2 ml-1" />
                  </span>
                </>
              )}
            </button>
          )}
          {step > 1 && !isLoading && (
            <button
              onClick={() => setStep(step - 1)}
              className="md:mt-5 bg-transparent  px-5 text-black py-2 rounded-lg"
            >
              Back
            </button>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Page;
