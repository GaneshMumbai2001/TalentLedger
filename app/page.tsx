"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import roundlap from "../assets/roundlap.svg";
import herohalf1 from "../assets/herohalf1.svg";
import herohalf2 from "../assets/herohalf2.svg";
import review1 from "../assets/review1.svg";
import review2 from "../assets/review2.svg";
import review3 from "../assets/review3.svg";
import review4 from "../assets/review4.svg";
import roundtick from "../assets/roundtick.svg";
import roundclick from "../assets/roundclick.svg";
import review1_logo from "../assets/review_logo1.svg";
import review2_logo from "../assets/review_logo2.svg";
import review3_logo from "../assets/review_logo3.svg";
import swing from "../assets/swing.svg";
import dashedline from "../assets/dashedline.svg";
import review4_logo from "../assets/review_logo4.svg";
import walleticon1 from "../assets/walleticon1.svg";
import walleticon2 from "../assets/walleticon2.svg";
import walleticon3 from "../assets/walleticon3.svg";
import experienced from "../assets/experienced.svg";
import ministar from "../assets/ministar.svg";
import collection from "../assets/collection.svg";
import forfreelancer from "../assets/forfreelancer.svg";
import forproviders from "../assets/forproviders.svg";
import question from "../assets/question.svg";
import solution from "../assets/solution.svg";
import candidstar from "../assets/candidstar.svg";
import hero2 from "../assets/hero2.svg";
import herotick from "../assets/herotick.svg";
import next from "../assets/next.svg";
import dash from "../assets/dash.svg";
import next2 from "../assets/next2.svg";
import collectionstar from "../assets/collectionstar.svg";
import Head from "next/head";
import Link from "next/link";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setDIDInfo, setToken } from "@/store/action";

import {
  FaAngleDown,
  FaArrowLeft,
  FaArrowRight,
  FaChevronRight,
  FaFacebookF,
  FaLinkedinIn,
  FaSearch,
} from "react-icons/fa";
import ProctedNav from "./Components/ProctedNav";
import { MdArrowOutward } from "react-icons/md";
import { DisableSSR } from "@/utils/disable-ssr";
import logo from "../assets/croplogo.svg";
import { FaXTwitter } from "react-icons/fa6";
import { getDIDInfos } from "@/config/BlockchainServices";
import { useEthereum } from "./Components/DataContext";

interface SearchProps {
  onSearch?: (searchTerm: string) => void;
}

export default function Home({ onSearch }: SearchProps) {
  const [visible, setVisible] = useState({});
  const [did, setDid] = useState<string>();
  const [resumeHave, setResumeHave] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { address, didData, balance } = useEthereum();
  console.log("add", address);
  console.log("did", didData);
  console.log("balance", balance);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const terms = [
      "Need expert Blockchain devs?..",
      "Dreaming of a unique website?..",
      "Explore cutting-edge tech with us...",
      "Join TalentLedger. Elevate your project...",
    ];
    let currentTermIndex = 0;
    let letterIndex = 0;
    let typingSpeed = 100;
    let nextTermDelay = 2000;

    const typeTerm = () => {
      if (letterIndex < terms[currentTermIndex].length) {
        setSearchTerm(terms[currentTermIndex].substring(0, letterIndex + 1));
        letterIndex++;
        setTimeout(typeTerm, typingSpeed);
      } else {
        setTimeout(() => {
          letterIndex = 0;
          currentTermIndex = (currentTermIndex + 1) % terms.length;
          typeTerm();
        }, nextTermDelay);
      }
    };

    typeTerm();
  }, []);

  const toggleVisibility = (index) => {
    setVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: any) => {
    const newSearchTerm = e.target.value;
    setIsTyping(true);
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  const [suggestedSkills, setSuggestedSkills] = useState([
    "WEB DESIGN",
    "UI/UX DESIGN",
    "FRONT END DEVELOPER",
    "BLOCKCHAIN",
  ]);

  const handleAddSkill = (skill: string) => {
    if (!searchTerm.includes(skill)) {
      setSearchTerm(searchTerm ? `${searchTerm}, ${skill}` : skill);
    }
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  const faqs = [
    {
      question: "How do I create an account on this platform?",
      answer:
        "GIGS is a modern platform for job hunting and hiring, offering a vast array of exciting opportunities.",
    },
    {
      question: "How can I post a job listing on the platform?",
      answer:
        "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities.",
    },
    {
      question: "What is the benefit of using tokens on this platform?",
      answer:
        "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities.",
    },
    {
      question: "How can I apply for a job using tokens?",
      answer:
        "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities.",
    },
    {
      question: "How can I post a job listing on the platform?",
      answer:
        "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities.",
    },
  ];
  const handleSearchSubmit = () => {
    console.log("Searching for:", searchTerm);
    if (didData == "") {
      router.push("/Signup");
    } else {
      console.log("diddata", didData[6]);
      if (didData[6] == 1) {
        router.push("/FreelancerDashboard");
      } else {
        router.push("/Dashboard");
      }
    }
  };
  const reviews = [
    {
      image: review1,
      logo: review1_logo,
      title: "Logo Designer",
      designer: "skydesigner",
    },
    {
      image: review2,
      logo: review2_logo,
      title: "Web & mobile Designer",
      designer: "skydesigner",
    },
    {
      image: review3,
      logo: review3_logo,
      title: "Packaging Designer",
      designer: "skydesigner",
    },
    {
      image: review4,
      logo: review4_logo,
      title: "Flyer Designer",
      designer: "skydesigner",
    },
    {
      image: review1,
      logo: review1_logo,
      title: "Logo Designer",
      designer: "skydesigner",
    },
    {
      image: review2,
      logo: review2_logo,
      title: "Web & mobile Designer",
      designer: "skydesigner",
    },
    {
      image: review3,
      logo: review3_logo,
      title: "Packaging Designer",
      designer: "skydesigner",
    },
    {
      image: review4,
      logo: review4_logo,
      title: "Flyer Designer",
      designer: "skydesigner",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = reviews.length - 4;

  const jobRoles = [
    "BACKEND DEVELOPER",
    "APP DEVELOPER",
    "FRONTEND DEVELOPER",
    "UI/UX DESIGNER",
    "DATA SCIENTIST",
    "DEVOPS ENGINEER",
    "PROJECT MANAGER",
  ];
  const jobRoles1 = [
    "CLOUD ARCHITECT",
    "SECURITY ANALYST",
    "SYSTEM ADMINISTRATOR",
    "MOBILE APP DEVELOPER",
    "NETWORK ENGINEER",
    "DATABASE ADMINISTRATOR",
    "SOFTWARE TESTER",
  ];
  const jobRoles2 = [
    "MACHINE LEARNING ENGINEER",
    "BLOCKCHAIN DEVELOPER",
    "EMBEDDED SYSTEMS ENGINEER",
    "FULL STACK DEVELOPER",
    "CONTENT STRATEGIST",
    "TECHNICAL WRITER",
    "CYBERSECURITY SPECIALIST",
  ];

  const duplicatedJobRoles = [...jobRoles, ...jobRoles, ...jobRoles];
  const duplicatedJobRoles1 = [...jobRoles1, ...jobRoles1, ...jobRoles1];
  const duplicatedJobRoles2 = [...jobRoles2, ...jobRoles2, ...jobRoles2];

  return (
    <DisableSSR>
      <main className="bg-[#ffffff] ">
        <Head>
          <Link shallow rel="icon" href="../assets/croplogo.svg" />
        </Head>
        <div className="bg-[#C9F8FF]  bg-cover bg-no-repeat  pb-24">
          <ProctedNav />
          <div className="flex  pt-8 md:pt-14 justify-center px-20">
            <div className="">
              <div className="flex">
                <Image
                  src={ministar}
                  className="pt-8 hover:animate-ping"
                  alt=""
                />
                <div className="text-center">
                  <p className="text-5xl font-serif px-7 rounded-lg py-2  font-semibold ">
                    Seamless Hiring Made Easy
                  </p>
                  <p className="text-5xl font-serif text-[#009DB5] font-semibold  px-2 py-2 rounded-full">
                    Unlock you Potential today
                  </p>
                  <p className="pt-3 px-52 text-lg">
                    Transform hiring with TalentLedger : NLP, ML, and blockchain
                    unite for <br /> efficiency, transparency, and personalized
                    engagement. Join us now!
                  </p>
                </div>
                <Image src={ministar} className="hover:animate-bounce" alt="" />
              </div>
              <div className=" flex ml-24 justify-center ">
                <div className="text-xl flex space-x-16 items-center relative text-white mt-5">
                  <div className="relative w-[600px]">
                    <FaSearch
                      className={`absolute left-5 top-1/2 transform -translate-y-1/2 ${
                        isTyping ? "text-gray-300" : "text-black"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Search any services..."
                      className="border w-full py-5 text-sm text-black md:block hidden rounded-full pl-12 pr-4 border-[#DCDCDC] outline-none"
                      onChange={handleSearchChange}
                      onFocus={() => setIsTyping(true)}
                      value={searchTerm}
                    />
                  </div>
                  <FaArrowRight
                    className="text-white md:block hidden -left-32 relative text-5xl p-3 bg-black rounded-full cursor-pointer wave-effect "
                    onClick={handleSearchSubmit}
                  />
                </div>
              </div>
              <div className="flex mt-5 text-center justify-center space-x-4">
                {suggestedSkills.length > 0 && <label>Popular Skills:</label>}

                <div className="text-sm flex space-x-4">
                  {suggestedSkills.map((skill, index) => (
                    <p
                      key={index}
                      onClick={() => handleAddSkill(skill)}
                      className="bg-[#FFFFFF] cursor-pointer animate-pulse flex space-x-2 px-3 py-1 rounded-full font-semibold items-center"
                    >
                      <span> {skill} </span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex px-32">
                <Image
                  src={ministar}
                  className="pt-8 hover:animate-ping rotate-180"
                  alt=""
                />
                <div className="flex space-x-14 items-center mx-auto  justify-center mt-12 px-5 py-3 bg-white rounded-2xl max-w-md">
                  <div>
                    <p className="text-lg font-bold mb-3">
                      Trusted Freelancers
                    </p>
                    <Image src={collection} alt="" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Image src={collectionstar} alt="" />
                    <p className="font-semibold text-sm">200+</p>
                    <p className="text-[#747474] text-md font-light">
                      Satisfied Customer
                    </p>
                  </div>
                </div>
                <Image
                  src={ministar}
                  className="pt-8 hover:animate-bounce  rotate-12"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pt-14">
          <p className="text-5xl font-semibold font-serif">
            Sound like <span className="text-[#009DB5]">you?</span>
          </p>
          <div className="flex justify-center space-x-8 mt-8">
            <p className="text-2xl font-medium font-sans">
              <span className="text-[#A0A3AB]">1.</span> Tokenized Postings
            </p>
            <Image src={next} alt="" />
            <p className="text-2xl font-medium font-sans">
              <span className="text-[#A0A3AB]">2.</span> Efficient Application
            </p>
            <Image src={next2} className="" alt="" />
            <p className="text-2xl font-medium font-sans">
              <span className="text-[#A0A3AB]">3.</span> Rewards for Matching
            </p>
          </div>
          <p className="text-sm mt-10">
            💡 Why settle for outdated hiring practices? Embrace the future with
            TalentLedger's approach to talent acquisition
          </p>
        </div>

        <div className="my-20 mt-24 flex xl:flex-row flex-col items-center    justify-center xl:-space-x-44   2xl:-space-x-72">
          <div className=" flex  w-1/2 flex-row justify-center   relative   ">
            <div className="bg-[#FBE2F4] z-10 px-8 py-5 w-[480px] rounded-xl">
              <p className="text-lg font-bold">For Freelancers</p>
              <p className="text-sm font-medium mt-1 mb-4">
                Find professionals from around <br /> the world and across all
                skills
              </p>
              <button className="text-white bg-black px-6 py-2 rounded-lg">
                Apply Gig
              </button>
            </div>

            <div className="z-10 left-80 -top-16 absolute">
              <Image className="h-56 w-auto" src={forfreelancer} alt="" />
            </div>
          </div>
          <div className=" flex  w-1/2 flex-row justify-center  relative  ">
            <div className="bg-[#E3DBFA] py-5 rounded-xl px-6 w-[450px]  z-10">
              <p className="text-lg font-bold">For Providers</p>
              <p className="text-sm font-medium mt-1 mb-4">
                Find professionals from around <br /> the world and across all
                skills
              </p>
              <button className="text-white bg-black px-6 py-2 rounded-lg">
                Post Gig
              </button>
            </div>
            <div className="z-10 left-96 -top-20 absolute">
              <Image className="h-60 w-auto" src={forproviders} alt="" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold flex flex-col text-center my-5">
            We Have Only <br />
            <span className=" flex  mx-auto">
              {" "}
              <p>
                Best <span className="text-[#009DB5]">Candidates</span>
              </p>{" "}
              <Image src={candidstar} alt="" />
            </span>
          </p>
          <div className="my-8">
            <div className="relative overflow-hidden marquee">
              <div className="marquee-content">
                {duplicatedJobRoles.map((role, index) => (
                  <p
                    key={index}
                    className="inline-block border border-[#DCDCDC] rounded-lg px-5 py-2"
                  >
                    {role}
                  </p>
                ))}
              </div>
              <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"></div>
            </div>
            <div className="relative my-10 overflow-hidden marquee">
              <div className="marquee-content-right">
                {duplicatedJobRoles1.map((role, index) => (
                  <p
                    key={index}
                    className="inline-block border border-[#DCDCDC] rounded-lg px-5 py-2"
                  >
                    {role}
                  </p>
                ))}
              </div>
              <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"></div>
            </div>
            <div className="relative my-10 overflow-hidden marquee">
              <div className="marquee-content">
                {duplicatedJobRoles2.map((role, index) => (
                  <p
                    key={index}
                    className="inline-block border border-[#DCDCDC] rounded-lg px-5 py-2"
                  >
                    {role}
                  </p>
                ))}
              </div>
              <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"></div>
            </div>
          </div>
        </div>
        <div className="bg-[#009DB5] bg-opacity-10 py-16">
          <div className="text-center flex  justify-center flex-col space-y-5">
            <div className="text-5xl font-semibold  font-serif">
              <p className="">
                Transform your
                <span className="flex flex-col justify-center items-center">
                  <p className="text-[#009DB5]">freelance career</p>
                  <Image src={dash} alt="" />
                </span>
              </p>
            </div>
            <p className=" font-medium text-2xl">
              TalentLedger integrates NLP, ML, and blockchain to offer a
              user-friendly platform <br /> for decentralized freelancing, job
              matching, and secure project management.
            </p>
          </div>
          <div className="flex space-x-3 mt-10 justify-center">
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Decentralized Identity</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Tailored Gigs</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Transparent Transactions</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Community Engagement</p>
            </div>
          </div>
          <div className="flex space-x-3 mt-6 justify-center">
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Secure Platform</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Candidate Dispute</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Streamlined Experience</p>
            </div>
            <div className="px-3 flex items-center text-lg space-x-1 py-2 rounded-3xl border-2 border-[#009DB5]">
              <Image src={roundtick} alt="" />
              <p>Global Opportunities</p>
            </div>
          </div>
        </div>

        <div className="bg-white px-16 flex md:flex-row flex-col py-16">
          <div className="   text-4xl   font-medium py-10 ">
            <p className="text-black w-80  ">
              <span className="flex space-x-3 items-center">
                {" "}
                <p>Some</p> <Image src={solution} alt="" />
              </span>{" "}
              Question’s Need <br />
              <span className="flex ml-28 space-x-3 items-center">
                <Image src={question} alt="" /> <p> Solutions!</p>
              </span>
            </p>
            <Image src={swing} className=" mt-5 ml-40" alt="" />
          </div>
          <div className="flex flex-col px-5 items-center rounded-b-full justify-center w-full">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center mb-4"
              >
                <button
                  className={` border text-black border-[#DCDCDC] ${
                    visible[index] ? "rounded-t-md" : "rounded-md"
                  } w-full md:w-[880px] font-semibold md:text-xl py-4 px-5 flex justify-between items-center mx-auto`}
                  onClick={() => toggleVisibility(index)}
                >
                  {faq.question}{" "}
                  <FaAngleDown
                    className={`${visible[index] ? "rotate-180" : ""}`}
                  />
                </button>
                {visible[index] && (
                  <div className="md:w-[880px] rounded-b-md border border-t-0 border-[#DCDCDC]  py-2 px-4 text-center mx-auto mt-0">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#141413]  text-white mx-20 rounded-xl  my-8 px-20 pt-10 pb-5 ">
          <div className="flex pb-8 pt-3 justify-between">
            <p className="text-4xl line-clamp-2 font-sans">
              Efficiently Connect{" "}
              <span className="text-[#009DB5]">Talent </span> <br /> and
              <span className="text-[#009DB5]"> Opportunity</span>
            </p>
            <div className="flex flex-col space-y-5 items-end">
              <Image src={roundclick} alt="" />
              <button className="px-4 text-xl py-2 rounded-xl bg-[#009DB5]">
                Get Started
              </button>
            </div>
          </div>
          <Image src={dashedline} alt="" className="w-full pt-3" />
          <div className="flex border-t-[#009DB5] border-dotted pt-8 space-x-60">
            <div>
              <div className="flex text-white items-center text-2xl font-medium space-x-2">
                <Image src={logo} className="h-12 w-auto" alt="" />
                <p>TalentLedger</p>
              </div>
              <p className="text-white font-light  text-[15px] my-4">
                Personalized Solutions for Job <br /> Seekers and Employers{" "}
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="text-xl font-bold">Company</p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>About</span>
              </p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>How its works</span>
              </p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>How to find works</span>
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="text-xl font-bold">Services</p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>Design and Creative</span>
              </p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>Website Development</span>
              </p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>Digital Marketing</span>
              </p>
              <p className="flex space-x-3  items-center text-sm cursor-pointer">
                <span>
                  <FaChevronRight />{" "}
                </span>{" "}
                <span>Mobile App Development</span>
              </p>
            </div>
          </div>
          <p className="text-center mt-12 pb-3 text-sm">
            © 2024 All right reserved by TalentLedger
          </p>
        </div>
      </main>
    </DisableSSR>
  );
}
