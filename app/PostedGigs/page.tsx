"use client";
import React, { useState, useEffect } from "react";
import ProctedNav from "../Components/ProctedNav";
import Link from "next/link";
import { AiOutlineArrowRight, AiOutlineLeft } from "react-icons/ai";
import Image from "next/image";
import Hero from "../../assets/Hero.png";
import Dicons from "../../assets/3dicons.png";
import { PiDotsThreeCircleVerticalLight } from "react-icons/pi";
import Particle from "../Components/Particles";
import axios from "axios";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { RootState } from "@/store/store";
import Navbar from "../Components/Navbar";
import { CheckTokenBalance } from "@/config/BlockchainServices";
type Gig = {
  _id: string;
  title: string;
  didOfPosted: string;
  budget: string;
  applicants: [string];
  description: string;
  status: "applied" | "ongoing" | "completed";
};

type GigCardProps = {
  gigsData: Gig[];
};
function Page() {
  const [activeTab, setActiveTab] = useState<
    "applied" | "ongoing" | "completed"
  >("applied");
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
  const [gigsData, setgigsData] = useState<Gig[] | undefined>();
  const [ongoinggigsData, setongoinggigsData] = useState<Gig[] | undefined>();
  const [completedgigsData, setcompletedgigsData] = useState<
    Gig[] | undefined
  >();
  // const filteredGigs = gigsData.filter((gig) => gig.status === activeTab);
  const buttonClass = (tab: "applied" | "ongoing" | "completed") =>
    `md:px-8 md:py-2 py-1 px-3  rounded-3xl ${
      activeTab === tab
        ? "text-[black] font-semibold bg-[rgba(255,255,255,0.37)]"
        : ""
    }`;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const openWithdrawModal = () => {
    setShowDropdown(false);
    setShowWithdrawModal(true);
  };
  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
  };
  const openExtendModal = () => {
    setShowDropdown(false);
    setShowExtendModal(true);
  };
  const closeExtendModal = () => {
    setShowExtendModal(false);
  };

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
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };
  const getOngoingGigsByUserId = async () => {
    try {
      const response = await axios.get(
        "https://gigshub-v1.vercel.app/api/get-current-gigs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setongoinggigsData(response.data.gigs);
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };
  const getCompletedGigsByUserId = async () => {
    try {
      const response = await axios.get(
        "https://gigshub-v1.vercel.app/api/get-completed-gigs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setcompletedgigsData(response.data.gigs);
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };

  useEffect(() => {
    getGigsByUserId();
    getOngoingGigsByUserId();
    getCompletedGigsByUserId();
  }, []);

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10">
      {/* <Particle /> */}
      <Navbar did={did} persona={persona} balance={balance} />
      <div className="mt-5 pb-2 md:mt-10 md:pb-5">
        <p className="text-3xl text-white text-center font-semibold ">
          Posted Gigs
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex px-5 space-x-8 rounded-xl text-white justify-center">
          <div className="selection   md:px-5 md:py-2 rounded-3xl flex md:gap-10">
            <button
              className={buttonClass("applied")}
              onClick={() => setActiveTab("applied")}
            >
              Posted Gigs
            </button>
            <button
              className={buttonClass("ongoing")}
              onClick={() => setActiveTab("ongoing")}
            >
              Current Gigs
            </button>
            <button
              className={buttonClass("completed")}
              onClick={() => setActiveTab("completed")}
            >
              Expired Gigs
            </button>
          </div>
        </div>
        <div className=" flex flex-col items-center md:mx-28  justify-center mt-8 px-2 md:px-0">
          {activeTab === "applied" &&
            gigsData &&
            gigsData.map((gig) => (
              <div
                key={gig._id}
                className="gigcard border px-2 my-2 md:w-[800px] rounded-2xl text-center border-gray-200 bg-white"
              >
                <div
                  className={`flex items-center ${
                    gig.status != "ongoing" ? "md:space-x-8" : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1   text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white font-semibold">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-xl text-white font-bold">
                    {gig.budget} Tokens
                  </p>
                  <p className="text-white ">•</p>
                  <p className="text-[white] md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>
                  <div className="md:flex space-y-1 md:space-y-0 md:space-x-2">
                    <>
                      <Link shallow href={`/PostedGigs/${gig._id}`} passHref>
                        <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                          {" "}
                          View Now
                        </button>
                      </Link>
                    </>

                    {gig.status == "applied" && (
                      <>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveDropdownId(
                                gig._id === activeDropdownId ? null : gig._id
                              )
                            }
                            className="md:text-2xl text-xl font-bold text-[#3498DB]"
                          >
                            <PiDotsThreeCircleVerticalLight />
                          </button>
                          {gig._id === activeDropdownId && (
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border border-white show-dropdown">
                              <button onClick={openWithdrawModal}>
                                Withdraw
                              </button>
                              <hr className="my-1" />
                              <button onClick={openExtendModal}>Extend</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {gig.status == "ongoing" && (
                      <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                        Release Fund
                      </button>
                    )}
                  </div>
                  {showWithdrawModal && (
                    <>
                      <div
                        className="modal-backdrop "
                        onClick={closeWithdrawModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Confirm Post Withdrawal
                        </p>
                        <p className="text-white">
                          Withdraw this post to receive a refund, but remember,
                          you won't be able to access the post once it's gone.
                          Proceed with withdrawal?
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                          onClick={closeWithdrawModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white] text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Withdraw Post
                        </button>
                      </div>
                    </>
                  )}

                  {showExtendModal && (
                    <>
                      <div
                        className="modal-backdrop"
                        onClick={closeExtendModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Extend Post Validity
                        </p>
                        <p className="text-white">
                          Would you like to extend the validity of this post? By
                          proceeding, you'll keep the post active and accessible
                          to potential applicants for an extended period.
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black  ] px-3 py-2 "
                          onClick={closeExtendModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white]  text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Extend Post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

          {activeTab === "ongoing" &&
            ongoinggigsData &&
            ongoinggigsData.map((gig) => (
              <div
                key={gig._id}
                className="gigcard border px-2 my-2 md:w-[800px] rounded-2xl text-center border-gray-200 bg-white"
              >
                <div
                  className={`flex items-center ${
                    gig.status != "ongoing" ? "md:space-x-8" : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1   text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white font-semibold">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-xl text-white font-bold">
                    {gig.budget} Tokens
                  </p>
                  <p className="text-white ">•</p>
                  <p className="text-[white] md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>
                  <div className="md:flex space-y-1 md:space-y-0 md:space-x-2">
                    <>
                      <Link shallow href={`/PostedGigs/${gig._id}`} passHref>
                        <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                          {" "}
                          View Now
                        </button>
                      </Link>
                    </>

                    {gig.status == "applied" && (
                      <>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveDropdownId(
                                gig._id === activeDropdownId ? null : gig._id
                              )
                            }
                            className="md:text-2xl text-xl font-bold text-[#3498DB]"
                          >
                            <PiDotsThreeCircleVerticalLight />
                          </button>
                          {gig._id === activeDropdownId && (
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border border-white show-dropdown">
                              <button onClick={openWithdrawModal}>
                                Withdraw
                              </button>
                              <hr className="my-1" />
                              <button onClick={openExtendModal}>Extend</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {gig.status == "ongoing" && (
                      <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                        Release Fund
                      </button>
                    )}
                  </div>
                  {showWithdrawModal && (
                    <>
                      <div
                        className="modal-backdrop "
                        onClick={closeWithdrawModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Confirm Post Withdrawal
                        </p>
                        <p className="text-white">
                          Withdraw this post to receive a refund, but remember,
                          you won't be able to access the post once it's gone.
                          Proceed with withdrawal?
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                          onClick={closeWithdrawModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white] text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Withdraw Post
                        </button>
                      </div>
                    </>
                  )}

                  {showExtendModal && (
                    <>
                      <div
                        className="modal-backdrop"
                        onClick={closeExtendModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Extend Post Validity
                        </p>
                        <p className="text-white">
                          Would you like to extend the validity of this post? By
                          proceeding, you'll keep the post active and accessible
                          to potential applicants for an extended period.
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black  ] px-3 py-2 "
                          onClick={closeExtendModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white]  text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Extend Post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          {activeTab === "completed" &&
            completedgigsData &&
            completedgigsData.map((gig) => (
              <div
                key={gig._id}
                className="gigcard border px-2 my-2 md:w-[800px] rounded-2xl text-center border-gray-200 bg-white"
              >
                <div
                  className={`flex items-center ${
                    gig.status != "ongoing" ? "md:space-x-8" : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1   text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white font-semibold">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-xl text-white font-bold">
                    {gig.budget} Tokens
                  </p>
                  <p className="text-white ">•</p>
                  <p className="text-[white] md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>
                  <div className="md:flex space-y-1 md:space-y-0 md:space-x-2">
                    <>
                      <Link shallow href={`/PostedGigs/${gig._id}`} passHref>
                        <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                          {" "}
                          View Now
                        </button>
                      </Link>
                    </>

                    {gig.status == "applied" && (
                      <>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveDropdownId(
                                gig._id === activeDropdownId ? null : gig._id
                              )
                            }
                            className="md:text-2xl text-xl font-bold text-[#3498DB]"
                          >
                            <PiDotsThreeCircleVerticalLight />
                          </button>
                          {gig._id === activeDropdownId && (
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border border-white show-dropdown">
                              <button onClick={openWithdrawModal}>
                                Withdraw
                              </button>
                              <hr className="my-1" />
                              <button onClick={openExtendModal}>Extend</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {gig.status == "ongoing" && (
                      <button className="text-center px-3  rounded-lg  py-1 text-white bg-[#3498DB]">
                        Release Fund
                      </button>
                    )}
                  </div>
                  {showWithdrawModal && (
                    <>
                      <div
                        className="modal-backdrop "
                        onClick={closeWithdrawModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Confirm Post Withdrawal
                        </p>
                        <p className="text-white">
                          Withdraw this post to receive a refund, but remember,
                          you won't be able to access the post once it's gone.
                          Proceed with withdrawal?
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                          onClick={closeWithdrawModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white] text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Withdraw Post
                        </button>
                      </div>
                    </>
                  )}

                  {showExtendModal && (
                    <>
                      <div
                        className="modal-backdrop"
                        onClick={closeExtendModal}
                      ></div>
                      <div className="modal rounded-lg border border-white bg-[#3498DB]">
                        <p className="text-xl text-white font-semibold">
                          Extend Post Validity
                        </p>
                        <p className="text-white">
                          Would you like to extend the validity of this post? By
                          proceeding, you'll keep the post active and accessible
                          to potential applicants for an extended period.
                        </p>
                        <button
                          className=" bg-transparent rounded-lg border-2 border-[black  ] px-3 py-2 "
                          onClick={closeExtendModal}
                        >
                          Cancel
                        </button>
                        <button className="bg-[white]  text-black px-2 py-2 rounded-lg ml-2 mt-5">
                          Extend Post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
