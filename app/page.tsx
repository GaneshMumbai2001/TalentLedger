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
import review1_logo from "../assets/review_logo1.svg";
import review2_logo from "../assets/review_logo2.svg";
import review3_logo from "../assets/review_logo3.svg";
import review4_logo from "../assets/review_logo4.svg";
import walleticon1 from "../assets/walleticon1.svg";
import walleticon2 from "../assets/walleticon2.svg";
import walleticon3 from "../assets/walleticon3.svg";
import experienced from "../assets/experienced.svg";
import collection from "../assets/collection.svg";
import forfreelancer from "../assets/forfreelancer.svg";
import forproviders from "../assets/forproviders.svg";
import hero2 from "../assets/hero2.svg";
import herotick from "../assets/herotick.svg";
import collectionstar from "../assets/collectionstar.svg";
import Head from "next/head";
import Link from "next/link";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/action";
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
import logo from "../assets/logo4.svg";
import { FaXTwitter } from "react-icons/fa6";

interface SearchProps {
  onSearch?: (searchTerm: string) => void;
}

export default function Home({ onSearch }: SearchProps) {
  const [visible, setVisible] = useState({});
  const [address, setAddress] = useState<string>();
  const [did, setDid] = useState<string>();
  const [resumeHave, setResumeHave] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [balance, setbalance] = useState();

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const animateValue = (start, end, duration, setter) => {
    let current = start;
    let range = end - start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));

    let timer = setInterval(() => {
      current += increment;
      setter(formatNumber(current));
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  };
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const terms = [
      "Need expert Blockchain devs?..",
      "Dreaming of a unique website?..",
      "Explore cutting-edge tech with us...",
      "Join Gigshub. Elevate your project...",
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

  // useEffect(() => {
  //   async function initialize() {
  //     if (typeof window.ethereum !== undefined) {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();

  //       const balance = await CheckTokenBalance(address);
  //       setbalance(balance);
  //       setAddress(address);
  //     }
  //   }
  //   initialize();
  // }, []);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      }
    }
    initialize();
  });

  // useEffect(() => {
  //   const res = getUser(address);
  // }, [address]);

  const getUser = async (address: any) => {
    const postData = {
      address: address,
    };
    const response = await fetch("https://gigshub-v1.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (response.ok) {
      const responseData = await response.json();
      const temp = ethers.utils.toUtf8String(responseData.did);
      setDid(temp);
      const token = responseData?.token;
      dispatch(setToken({ token }));
      try {
        const response = await fetch(
          `https://gigshub-v1.vercel.app/api/get-resume/${responseData.did}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          setResumeHave(true);
          router.push("/Home");
        }
      } catch (error) {}
    }
  };

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
  ];
  const handleSearchSubmit = () => {
    console.log("Searching for:", searchTerm);
    router.push("/Signup");
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

  const slideRight = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex > maxIndex ? 0 : nextIndex;
    });
  };

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? maxIndex : nextIndex;
    });
  };

  const visibleReviews = (() => {
    let itemsToShow = reviews.slice(currentIndex, currentIndex + 4);
    if (itemsToShow.length < 4) {
      itemsToShow = itemsToShow.concat(
        reviews.slice(0, 4 - itemsToShow.length)
      );
    }
    return itemsToShow;
  })();
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
          <Link shallow rel="icon" href="../assets/Logo.ico" />
        </Head>
        <div className="bg-[#FBF4EE]  bg-cover bg-no-repeat  pb-24">
          <ProctedNav />
          <div className="flex  pt-8 md:pt-14 justify-between px-20">
            <div className="">
              <div className="flex space-x-3 items-center justify-start">
                <p className="text-5xl font-mono px-7 rounded-lg py-2 font-extrabold bg-[#FFCE4C]">
                  Explore
                </p>
                <p className="text-5xl bg-[#00CBA0]  px-2 py-2 rounded-full">
                  <MdArrowOutward />
                </p>
                <Image src={roundlap} className="h-16 w-auto" alt="" />
              </div>
              <div className="mt-3 ">
                <div className="flex justify-start">
                  <p className="text-5xl font-mono px-7  rounded-lg py-2 font-extrabold bg-[#00CBA0]">
                    Tokenize Progress
                  </p>
                </div>
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
              <div className="flex mt-5  space-x-4">
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
              <div>
                <p className="mt-6 text-[#212529] text-lg w-[620px]">
                  Explore opportunities, earn tokens, and revolutionize hiring.
                  Say goodbye to traditional job searches—welcome to the future
                </p>
              </div>
              <div className="flex space-x-14 items-center mt-5 px-5 py-3 bg-white rounded-2xl max-w-md">
                <div>
                  <p className="text-lg font-bold mb-3">Trusted Freelancers</p>
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
            </div>
            <div className="flex mr-20  -space-x-40">
              <div className="flex  z-10 -space-x-10">
                <Image
                  src={walleticon1}
                  className="  hover:animate-bounce  -mt-48 z-10"
                  alt=""
                />
                <Image src={herohalf2} className=" mt-20" alt="" />
                <Image
                  src={walleticon2}
                  className=" hover:animate-bounce z-10 mt-[370px]"
                  alt=""
                />
              </div>
              <div className="flex items-start -space-x-16">
                <Image
                  src={walleticon3}
                  className="z-10 -mt-14  hover:animate-bounce"
                  alt=""
                />
                <Image src={herohalf1} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="my-20 flex xl:flex-row flex-col items-center    justify-center xl:-space-x-44   2xl:-space-x-72">
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
          <p className="text-3xl font-bold text-center my-5">
            We Have Only <br />
            Best<span className="text-[#FFCE4C]"> Candidates</span>
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

        <div className="bg-black justify-between items-center text-white px-20 pt-10 pb-20 flex">
          <div>
            <p className="text-3xl mb-10 font-bold">
              The best part? Everything
            </p>
            <div className="py-5">
              <div className="flex space-x-3 items-center">
                <Image src={herotick} alt="" />
                <p className="text-lg font-medium">Stick to your budget</p>
              </div>
              <p className="text-sm">
                Find the right service for every price point. No hourly rates,
                just project-based pricing.
              </p>
            </div>
            <div className="py-5">
              <div className="flex space-x-3 items-center">
                <Image src={herotick} alt="" />
                <p className="text-lg font-medium">
                  Get quality work done quickly
                </p>
              </div>
              <p className="text-sm">
                Hand your project over to a talented freelancer in minutes, get
                long-lasting results.
              </p>
            </div>
            <div className="py-5">
              <div className="flex space-x-3 items-center">
                <Image src={herotick} alt="" />
                <p className="text-lg font-medium">Pay when you're happy</p>
              </div>
              <p className="text-sm">
                Upfront quotes mean no surprises. Payments only get released
                when you approve.
              </p>
            </div>
            <div className="py-5">
              <div className="flex space-x-3 items-center">
                <Image src={herotick} alt="" />
                <p className="text-lg font-medium">Count on 24/7 support</p>
              </div>
              <p className="text-sm">
                Our round-the-clock support team is available to help anytime,
                anywhere.
              </p>
            </div>
          </div>
          <Image src={hero2} alt="" />
        </div>
        <div className="px-20 flex items-center py-20 justify-center space-x-32">
          <Image src={experienced} className="h-96 w-auto" alt="" />
          <div>
            <p className="text-3xl font-bold">
              Experienced
              <br /> Freelancers
            </p>
            <p className="text-sm pt-3 pb-14 text-[#747474]">
              Experienced freelancers possess a deep understanding of their
              craft,
              <br /> delivering top-quality work that exceeds client
              expectations.
            </p>
            <button className="text-white bg-black px-6 py-2 rounded-lg">
              Start Finding
            </button>
          </div>
        </div>
        <div className="bg-[#E3DBFA] pt-10 pb-5 px-20">
          <p className="text-center text-4xl font-bold">
            Inspiring work made on gigshub
          </p>
          <div className="relative">
            <button
              onClick={slideLeft}
              className="absolute bg-white p-3 rounded-full left-24 top-32 z-10"
            >
              <FaArrowLeft />
            </button>
            <div className="flex space-x-5 my-10 justify-center">
              {visibleReviews.map((review, index) => (
                <div key={index} className="bg-white p-1.5 rounded-lg">
                  <Image src={review.image} alt="" />
                  <div className="flex space-x-3 py-2 items-center">
                    <Image src={review.logo} alt="" />
                    <div>
                      <p className="text-md font-medium ">{review.title}</p>
                      <p className="text-sm text-[#747474] font-light">
                        by {review.designer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={slideRight}
              className="absolute bg-white p-3 rounded-full right-24 bottom-32 z-10"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
        <div className="bg-white px-16 flex md:flex-row flex-col py-20">
          <div className="   text-4xl   font-bold py-10 ">
            <p className="text-black  ">
              Frequently Asked <br />
              Question
            </p>
            <p className="text-black pt-5 font-normal text-lg ">
              Didn’t find the right answer? here you can ask your own questions
              to our support
            </p>
            <button className="bg-black rounded-2xl mt-16 px-6 py-2 text-white space-x-3 flex  text-lg items-center">
              <span>Submit Question </span>
              <FaArrowRight />
            </button>
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
        <div className="bg-[#141413]  text-white mx-20 rounded-xl mt-10 my-8 px-20 pt-10 pb-5 ">
          <div className="flex space-x-60">
            <div>
              <Image src={logo} className="h-12 w-auto" alt="" />
              <p className="text-white font-light  text-[15px] my-4">
                Hi You will find everything on this
                <br /> platform.
              </p>
              <div className="flex space-x-3">
                <FaFacebookF
                  className="p-2 bg-white rounded-md text-black cursor-pointer "
                  size="2em"
                />
                <FaLinkedinIn
                  className="p-2 bg-white rounded-md text-black cursor-pointer "
                  size="2em"
                />
                <FaXTwitter
                  className="p-2 bg-white rounded-md text-black cursor-pointer "
                  size="2em"
                />
              </div>
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
          <p className="text-center mt-32 pb-3 text-sm">
            © 2024 All right reserved by Gigshub
          </p>
        </div>
      </main>
    </DisableSSR>
  );
}
