"use client";
import React, { useState, useEffect } from "react";
import ProctedNav from "../../Components/ProctedNav";
import Link from "next/link";
import Image from "next/image";
import Dicons from "../../../assets/3dicons.png";
import Thumbs from "../../../assets/thumbs.png";
import Particle from "@/app/Components/Particles";
import axios from "axios";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/app/Components/Navbar";
import { CheckTokenBalance } from "@/config/BlockchainServices";

interface Gig {
  _id: string;
  title: string;
  didOfPosted: string;
  budget: string;
  applicants: [string];
  description: string;
  createdBy: string;
  selectedCandidate: string;
}

interface Applicant {
  id: number;
  name: string;
}

const applicantsData: Applicant[] = [
  { id: 1, name: "JohnSmit.eth" },
  { id: 2, name: "JohnSmit.eth" },
  { id: 3, name: "JohnSmit.eth" },
  { id: 4, name: "JohnSmit.eth" },
  { id: 5, name: "JohnSmit.eth" },
  { id: 6, name: "JohnSmit.eth" },
  { id: 7, name: "JohnSmit.eth" },
  { id: 8, name: "JohnSmit.eth" },
];
const sortedList: Applicant[] = [
  { id: 1, name: "JohnSmit.eth" },
  { id: 2, name: "JohnSmit.eth" },
  { id: 3, name: "JohnSmit.eth" },
];

const Page: React.FC = () => {
  const [istriggered, setIstriggered] = useState(false);
  const [gigsData, setgigsData] = useState<Gig[] | undefined>();

  const [filData, setfilData] = useState<Gig[] | undefined>();

  const [selectedCand, setSelectedCand] = useState("");

  const searchParams = useSearchParams();
  const id = searchParams.get("");
  const href = window.location.href;
  const segments = href.split("/");
  const lastSegment = segments.pop();

  function toggleTrigger() {
    setIstriggered(true);
  }
  function reversetoggleTrigger() {
    setIstriggered(false);
  }

  const token = useSelector((state: RootState) => state.auth.token);

  const getGigsByUserId = async () => {
    try {
      const response = await axios.get(
        "https://gigshub-v1.vercel.app/api/get-gigs",
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
      if (filteredData[0].selectedCandidate != "") {
        setIstriggered(true);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };
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
  useEffect(() => {
    getGigsByUserId();
  }, [token, lastSegment]);

  const selectCandidate = async (gigId, candidateId, token) => {
    try {
      const response = await axios.post(
        `https://gigshub-v1.vercel.app/api/select-candidate/${gigId}/${candidateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const SelectCand = async (applicant) => {
    const res = await selectCandidate(lastSegment, applicant, token);
    if (res?.status === 201) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10">
      <Navbar did={did} persona={persona} balance={balance} />

      <div className="flex flex-col md:flex-row pt-5 md:pt-12 md:px-20">
        {filData?.map((filData) => (
          <div className="px-10 md:px-20">
            <div className="flex space-x-7 mt-2">
              <div>
                <p className="text-2xl mt-1 text-[#3498DB] font-semibold">
                  {filData.title}
                </p>
                <p className="text-left text-white font-semibold">
                  created by{" "}
                  {filData &&
                    ethers.utils
                      .toUtf8String(filData.didOfPosted)
                      .replace(/[^a-zA-Z0-9]/g, "")}
                </p>
              </div>
            </div>
            <div className="text-white">
              <p className="mt-8 mb-4">{filData && filData.description}</p>
              <p className="my-4 text-sm">
                <span className="text-3xl font-semibold">
                  {filData && filData.budget}
                </span>
              </p>
              <p className="my-8 text-2xl text-white">
                <span className="text-[#3498DB] font-semibold">
                  Number of Applicants so far :{" "}
                </span>
                {filData && filData.applicants.length} applicants
              </p>
              {!istriggered ? (
                <></>
              ) : (
                <>
                  <button
                    onClick={reversetoggleTrigger}
                    className="bg-[#3498DB]  text-white text-xl px-3 py-2 rounded-xl flex justify-center items-center"
                  >
                    View Applicant Gigs
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="flex-grow">
          {!istriggered ? (
            <>
              <p className="text-[#3498DB]  text-2xl font-bold px-10 my-5">
                Applicants List
              </p>
              <div className="overflow-auto mx-3 scrollable-list   h-96 md:h-auto md:max-h-[450px] flex flex-col text-white md:space-y-3 px-4 md:px-10">
                {filData &&
                  filData.map((gig) => (
                    <div
                      key={gig._id}
                      className="flex px-8 items-center justify-between py-2 applicantlist border border-[#FFF] rounded-lg space-x-3 my-2 md:space-x-16"
                    >
                      {gig.applicants.map((applicant, index) => (
                        <div key={index}>
                          {applicant && (
                            <>
                              <p>
                                {ethers.utils.isBytesLike(applicant)
                                  ? ethers.utils
                                      .toUtf8String(applicant)
                                      .replace(/[^a-zA-Z0-9]/g, "")
                                  : "Invalid Applicant"}
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
                              {gig.selectedCandidate == null ? (
                                <p
                                  className="bg-[#3498DB] w-32 text-white text-md px-3 my-4 cursor-pointer py-2 rounded-xl"
                                  onClick={() => SelectCand(applicant)}
                                >
                                  Select
                                </p>
                              ) : (
                                ""
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-white">
                selected candidate
                <div>
                  {filData &&
                    filData.map((gig) => (
                      <p>
                        {gig?.selectedCandidate
                          ? ethers.utils.toUtf8String(gig.selectedCandidate)
                          : "No candidate selected"}
                      </p>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
