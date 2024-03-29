"use client";
import React, { useState } from "react";
import ProctedNav from "../../Components/ProctedNav";
import Link from "next/link";
import Image from "next/image";
import Dicons from "../../../assets/3dicons.png";
import Thumbs from "../../../assets/thumbs.png";
import { useSearchParams } from "next/navigation";
import { viewIPFSData } from "@/config/pintoIPFS";
import { ApplyGigs, CheckTokenBalance } from "@/config/BlockchainServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Particle from "@/app/Components/Particles";
import axios from "axios";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import Navbar from "@/app/Components/Navbar";
import "react-toastify/dist/ReactToastify.css";

interface JobDetails {
  id: number;
  title: string;
  creator: string;
  description: string;
  content: string;
  price: string;
  applicantsCount: number;
}

interface Applicant {
  id: number;
  name: string;
}

type Gig = {
  _id: string;
  title: string;
  didOfPosted: string;
  budget: string;
  applicants: [string];
  description: string;
  createdBy: string;
};
const Page: React.FC = () => {
  const [istriggered, setIstriggered] = useState(false);
  const [jobDetails, setjobdetails] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [filData, setfilData] = useState<Gig[] | undefined>();
  const [gigsData, setgigsData] = useState<Gig[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [did, setDid] = useState("");
  const [persona, setPersona] = useState<string>();
  const [address, setAddress] = useState("");
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
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const token = useSelector((state: RootState) => state.auth.token);
  const href = window.location.href;
  const segments = href.split("/");
  const lastSegment = segments.pop();
  function toggleTrigger() {
    setIstriggered(true);
  }

  const getGigsByUserId = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://gigshub-v1.vercel.app/api/all-gigs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setgigsData(response.data.gigs);
      const data = response.data.gigs;
      const filteredData = data?.filter((item) => item._id == lastSegment);
      setfilData(filteredData);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGigsByUserId();
  }, [token, lastSegment]);

  useEffect(() => {
    checkIfApplied();
  }, [lastSegment]);

  const checkIfApplied = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://gigshub-v1.vercel.app/api/check-application/${lastSegment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.applied) {
        setHasApplied(true);
      } else {
        setHasApplied(false);
      }
    } catch (error) {
      console.error(error);
      setHasApplied(false);
    } finally {
      setIsLoading(false);
    }
  };

  const applyGig = async () => {
    if (!hasApplied) {
      try {
        const response = await axios.post(
          `https://gigshub-v1.vercel.app/api/apply-for-gig/${lastSegment}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.status === 203) {
          toast.error("Oops! Already applied");
        } else if (response?.status === 201) {
          setHasApplied(true);
          toast.success("Successfully Applied");
          setIstriggered(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10">
      <Navbar did={did} persona={persona} balance={balance} />
      <ToastContainer />
      {!istriggered &&
        filData?.map((gig, index) => (
          <>
            <div className="flex flex-col md:flex-row pt-5 md:pt-12 md:px-20">
              <div className="px-10 md:px-20">
                <div className="flex space-x-7 mt-2">
                  <div>
                    <p className="text-2xl mt-1 text-[#3498DB] font-semibold">
                      <span className="text-white">Looking for</span>{" "}
                      {gig?.title}
                    </p>
                    <p className="text-left text-white font-semibold">
                      created by{" "}
                      <span className="text-[#3498DB]">
                        {" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-white">
                  <p className="text-[#3498DB] font-semibold mt-8 text-2xl ">
                    Description
                  </p>
                  <p className=" mb-4">{gig?.description}</p>
                  {/* <p>{jobDetails.content}</p> */}
                  <p className="my-4 text-sm">
                    <span className="text-3xl font-semibold">
                      {gig?.budget} Gig Token
                    </span>
                  </p>
                  <p className="my-8 text-2xl text-white">
                    <span className="text-[#3498DB] font-semibold">
                      Number of Applicants so far :{" "}
                    </span>
                    {gig.applicants.length} applicants
                  </p>
                  <button
                    onClick={applyGig}
                    className={`bg-[#3498DB] w-32 text-white text-xl px-3 py-2 rounded-xl flex justify-center items-center ${
                      hasApplied || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={hasApplied || isLoading}
                  >
                    {isLoading
                      ? "Loading..."
                      : hasApplied
                      ? "Applied"
                      : "Apply Now"}
                  </button>
                  <ToastContainer />
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-[#3498DB]  text-2xl font-bold px-10 my-5">
                  Applicants List
                </p>
                <div className="overflow-auto mx-3 scrollable-list   h-96 md:h-auto md:max-h-[450px] flex flex-col text-white md:space-y-3 px-4 md:px-10">
                  {gig.applicants.map((applicant, index) => (
                    <div
                      key={index}
                      className="flex px-8 items-center justify-between py-2 applicantlist border border-[#FFF] rounded-lg space-x-3 my-2 md:space-x-16"
                    >
                      <p>{index + 1}.</p>
                      <p>
                        {applicant != ""
                          ? ethers.utils
                              .toUtf8String(applicant)
                              .replace(/[^a-zA-Z0-9]/g, "")
                          : "df"}
                      </p>
                      <Link
                        href={`/${
                          ethers.utils.isBytesLike(applicant)
                            ? ethers.utils
                                .toUtf8String(applicant)
                                .replace(/[^a-zA-Z0-9]/g, "")
                            : "invalid"
                        }`}
                        passHref
                      >
                        <p className="bg-[#3498DB] w-32 text-white text-md px-3 py-2 rounded-xl">
                          View Profile
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ))}
      {istriggered && (
        <div>
          <p className="text-center text-white mt-20 font-bold text-2xl md:text-5xl">
            Successfully Applied!!
          </p>
          <div className="flex justify-center">
            <Image src={Thumbs} alt="" className="h-96" />
          </div>
          <div className="flex justify-center mt-10">
            <Link shallow href="/Myapplications">
              <button className="bg-[#3498DB] text-white md:text-xl px-5 py-2 rounded-xl">
                <span className="flex items-center">View applied jobs</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
