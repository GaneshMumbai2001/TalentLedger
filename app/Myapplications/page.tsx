"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineLeft } from "react-icons/ai";
import Dicons from "../../assets/3dicons.png";
import { PiDotsThreeCircleVerticalLight } from "react-icons/pi";
import { RootState } from "@/store/store";
import axios from "axios";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import Navbar from "../Components/Navbar";
import { CheckTokenBalance } from "@/config/BlockchainServices";
type Gig = {
  _id: number;
  title: string;
  didOfPosted: string;
  budget: string;
  applicants: [string];
  selectedCandidate: string;
  status: "applied" | "ongoing" | "completed";
  dropped: boolean;
  gigPaidOut: boolean;
  gigPaidToEscrow: boolean;
};

const gigsData: Gig[] = [
  {
    id: 1,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "applied",
  },
  {
    id: 2,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "applied",
  },
  {
    id: 3,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "applied",
  },
  {
    id: 4,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "ongoing",
  },
  {
    id: 5,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "ongoing",
  },

  {
    id: 9,
    title: "Frontend Developer",
    creator: "thiru.gig",
    price: "0.01 Matic",
    applicants: 10,
    imageSrc: Dicons,
    status: "completed",
  },
];

function Page() {
  const [activeTab, setActiveTab] = useState<
    "applied" | "ongoing" | "completed"
  >("applied");
  const filteredGigs = gigsData.filter((gig) => gig.status === activeTab);
  const [showDropdown, setShowDropdown] = useState(false);
  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");
  const [balance, setBalance] = useState("");
  const [persona, setPersona] = useState<string>();
  const dispatch = useDispatch();

  const [showgiveupModal, setShowgiveupModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [gigData, setgigData] = useState<Gig[] | undefined>();
  const [onGOinggigData, onGOingsetgigData] = useState<Gig[] | undefined>();
  const [CompletedgigData, CompletedetgigData] = useState<Gig[] | undefined>();

  const token = useSelector((state: RootState) => state.auth.token);

  const [filData, setfilData] = useState<Gig[] | undefined>();
  const opengiveupModal = () => {
    setShowDropdown(false);
    setShowgiveupModal(true);
  };
  const closegiveupModal = () => {
    setShowgiveupModal(false);
  };
  const buttonClass = (tab: "applied" | "ongoing" | "completed") =>
    `md:px-8 md:py-2 py-1 px-3  rounded-3xl ${
      activeTab === tab
        ? "text-[black] font-semibold bg-[rgba(255,255,255,0.37)]"
        : ""
    }`;

  const getGigsByUserId = async (id) => {
    try {
      const response = await axios.get(
        `https://gigshub-v1.vercel.app/api/gigs-with-applicant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setgigData(response.data.gigs);
      console.log(response.data.gigs);

      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };
  const getOnGoingGigsByUserId = async (id) => {
    try {
      const response = await axios.get(
        `https://gigshub-v1.vercel.app/api/ongoinggigs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onGOingsetgigData(response.data.gigs);
      console.log(response.data.gigs);

      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };
  const getCompletedigsByUserId = async (id) => {
    try {
      const response = await axios.get(
        `https://gigshub-v1.vercel.app/api/completed-gigs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      CompletedetgigData(response.data.gigs);
      console.log(response.data.gigs);

      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };

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
      const didData = responseData.did;
      getGigsByUserId(didData);
      getOnGoingGigsByUserId(didData);
      getCompletedigsByUserId(didData);
      const personatype = responseData.persona;
      setPersona(personatype);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getUser(address);
  }, []);

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

  useEffect(() => {
    const res = getUser(address);
  }, [address]);

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10 ">
      <Navbar did={did} persona={persona} balance={balance} />
      <div className=" md:px-20 px-10 flex flex-col space-y-10 py-10">
        <Link shallow href="/Home">
          <p className="text-sm text-white font-semibold flex">
            <AiOutlineLeft className="mt-1 text-sm mr-1" /> Go Back
          </p>
        </Link>
        <div className="flex flex-col md:flex-row  justify-between">
          <p className="text-2xl text-[#3498DB] mb-2 md:mb-0 font-semibold">
            Gig.gig
          </p>
          <div className="flex space-x-8 md:space-x-5">
            <Link shallow href="/MyProfile">
              <button className="bg-[#3498DB]    text-white text-md px-3 py-2 rounded-xl">
                View Profile
              </button>
            </Link>
            <Link shallow href="/EditProfile">
              <button className="bg-[#3498DB]  text-white text-md px-3 py-2 rounded-xl">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex px-5 space-x-8 rounded-xl text-white justify-center">
          <div className="selection   md:px-5 md:py-2 rounded-3xl flex md:gap-10">
            <button
              className={buttonClass("applied")}
              onClick={() => setActiveTab("applied")}
            >
              Applied Gigs
            </button>
            <button
              className={buttonClass("ongoing")}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing Gigs
            </button>
            <button
              className={buttonClass("completed")}
              onClick={() => setActiveTab("completed")}
            >
              Completed Gigs
            </button>
          </div>
        </div>
        <div className=" flex flex-col items-center md:mx-28  justify-center mt-8 px-2 md:px-0">
          {activeTab == "applied" &&
            gigData?.length > 0 &&
            gigData?.map((gig) => (
              <div
                key={gig._id}
                className="  border  px-2    my-2  md:w-[830px] rounded-2xl text-center border-gray-200 bg-transparent"
              >
                <div
                  className={`flex items-center ${
                    !gig.dropped && !gig.gigPaidOut
                      ? "md:space-x-7"
                      : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1 px-4  text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white ">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-lg text-white font-bold">
                    {gig.budget}
                  </p>
                  <p className="text-[#3498DB]">•</p>
                  <p className="text-[#3498DB] text-sm md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>

                  <div
                    className={` ${
                      gig.status != "applied"
                        ? "md:flex space-y-1 md:space-x-2"
                        : "md:space-x-2"
                    } `}
                  >
                    <Link shallow href={`/AllGigs/${gig._id}`} passHref>
                      <button className="text-center px-3  rounded-lg  py-2 text-white bg-[#3498DB]">
                        {" "}
                        View your Applicatiion
                      </button>
                      {/* {
                      gig.status == "ongoing" && (
                        <><button className='bg-[#B8A6FE] py-1 px-2 md:mx-2 rounded-lg text-[#000]'>Give Up</button></>
                      )
                    } */}
                      {gig.status == "completed" && (
                        <>
                          <button className="completedbtn py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            Completed
                          </button>
                        </>
                      )}
                      {gig?.dropped == true && (
                        <>
                          <button className="giveup py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            You Gave up
                          </button>
                        </>
                      )}
                    </Link>
                    {gig?.gigPaidToEscrow == true && (
                      <>
                        <Link shallow href="/Connect" passHref>
                          <button className="text-center px-3  rounded-lg  py-1 text-black bg-[white]">
                            {" "}
                            Connect
                          </button>
                        </Link>
                      </>
                    )}
                    {gig.status == "ongoing" && (
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
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border font-bold border-white show-dropdown">
                              <button onClick={opengiveupModal}>Give up</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {showgiveupModal && (
                      <>
                        <div
                          className="modal-backdrop "
                          onClick={closegiveupModal}
                        ></div>
                        <div className="modal rounded-lg border border-white bg-[#3498DB]">
                          <p className="text-xl text-white font-semibold">
                            Give Up?
                          </p>
                          <p className="text-white">
                            Are you sure you want to give up this job? If you
                            proceed, you will no longer be associated with this
                            job.
                          </p>
                          <button
                            className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                            onClick={closegiveupModal}
                          >
                            Cancel
                          </button>
                          <button className="bg-[black] text-white px-4 py-3 rounded-lg ml-2 mt-5">
                            Give Up
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {activeTab == "ongoing" &&
            onGOinggigData &&
            onGOinggigData?.length > 0 &&
            onGOinggigData?.map((gig) => (
              <div
                key={gig._id}
                className="  border  px-2    my-2  md:w-[830px] rounded-2xl text-center border-gray-200 bg-transparent"
              >
                <div
                  className={`flex items-center ${
                    !gig.dropped && !gig.gigPaidOut
                      ? "md:space-x-7"
                      : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1 px-4  text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white ">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-lg text-white font-bold">
                    {gig.budget}
                  </p>
                  <p className="text-[#3498DB]">•</p>
                  <p className="text-[#3498DB] text-sm md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>

                  <div
                    className={` ${
                      gig.status != "applied"
                        ? "md:flex space-y-1 md:space-x-2"
                        : "md:space-x-2"
                    } `}
                  >
                    <Link shallow href={`/AllGigs/${gig._id}`} passHref>
                      <button className="text-center px-3  rounded-lg  py-2 text-white bg-[#3498DB]">
                        {" "}
                        View your Applicatiion
                      </button>
                      {/* {
                      gig.status == "ongoing" && (
                        <><button className='bg-[#B8A6FE] py-1 px-2 md:mx-2 rounded-lg text-[#000]'>Give Up</button></>
                      )
                    } */}
                      {gig.status == "completed" && (
                        <>
                          <button className="completedbtn py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            Completed
                          </button>
                        </>
                      )}
                      {gig?.dropped == true && (
                        <>
                          <button className="giveup py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            You Gave up
                          </button>
                        </>
                      )}
                    </Link>
                    {gig?.gigPaidToEscrow == true && (
                      <>
                        <Link shallow href="/Connect" passHref>
                          <button className="text-center px-3  rounded-lg  py-1 text-black bg-[white]">
                            {" "}
                            Connect
                          </button>
                        </Link>
                      </>
                    )}
                    {gig.status == "ongoing" && (
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
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border font-bold border-white show-dropdown">
                              <button onClick={opengiveupModal}>Give up</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {showgiveupModal && (
                      <>
                        <div
                          className="modal-backdrop "
                          onClick={closegiveupModal}
                        ></div>
                        <div className="modal rounded-lg border border-white bg-[#3498DB]">
                          <p className="text-xl text-white font-semibold">
                            Give Up?
                          </p>
                          <p className="text-white">
                            Are you sure you want to give up this job? If you
                            proceed, you will no longer be associated with this
                            job.
                          </p>
                          <button
                            className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                            onClick={closegiveupModal}
                          >
                            Cancel
                          </button>
                          <button className="bg-[black] text-white px-4 py-3 rounded-lg ml-2 mt-5">
                            Give Up
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {activeTab == "completed" &&
            CompletedgigData &&
            CompletedgigData?.length > 0 &&
            CompletedgigData?.map((gig) => (
              <div
                key={gig._id}
                className="  border  px-2    my-2  md:w-[830px] rounded-2xl text-center border-gray-200 bg-transparent"
              >
                <div
                  className={`flex items-center ${
                    !gig.dropped && !gig.gigPaidOut
                      ? "md:space-x-7"
                      : "md:space-x-2"
                  } space-x-2 justify-center mt-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-lg md:my-1 px-4  text-white font-semibold">
                        {gig.title}
                      </p>
                      <p className=" text-sm text-white ">
                        created by{" "}
                        {ethers.utils
                          .toUtf8String(gig.didOfPosted)
                          .replace(/[^a-zA-Z0-9]/g, "")}
                      </p>
                    </div>
                  </div>
                  <p className="md:text-lg text-white font-bold">
                    {gig.budget}
                  </p>
                  <p className="text-[#3498DB]">•</p>
                  <p className="text-[#3498DB] text-sm md:block hidden font-semibold">
                    {gig.applicants.length} applicants
                  </p>

                  <div
                    className={` ${
                      gig.status != "applied"
                        ? "md:flex space-y-1 md:space-x-2"
                        : "md:space-x-2"
                    } `}
                  >
                    <Link shallow href={`/AllGigs/${gig._id}`} passHref>
                      <button className="text-center px-3  rounded-lg  py-2 text-white bg-[#3498DB]">
                        {" "}
                        View your Applicatiion
                      </button>
                      {/* {
                      gig.status == "ongoing" && (
                        <><button className='bg-[#B8A6FE] py-1 px-2 md:mx-2 rounded-lg text-[#000]'>Give Up</button></>
                      )
                    } */}
                      {gig.status == "completed" && (
                        <>
                          <button className="completedbtn py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            Completed
                          </button>
                        </>
                      )}
                      {gig?.dropped == true && (
                        <>
                          <button className="giveup py-1 px-2  md:ml-2 rounded-lg text-[#FFF]">
                            You Gave up
                          </button>
                        </>
                      )}
                    </Link>
                    {gig?.gigPaidToEscrow == true && (
                      <>
                        <Link shallow href="/Connect" passHref>
                          <button className="text-center px-3  rounded-lg  py-1 text-black bg-[white]">
                            {" "}
                            Connect
                          </button>
                        </Link>
                      </>
                    )}
                    {gig.status == "ongoing" && (
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
                            <div className="dropdown-menu right-0 md:right-2 rounded-lg border font-bold border-white show-dropdown">
                              <button onClick={opengiveupModal}>Give up</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {showgiveupModal && (
                      <>
                        <div
                          className="modal-backdrop "
                          onClick={closegiveupModal}
                        ></div>
                        <div className="modal rounded-lg border border-white bg-[#3498DB]">
                          <p className="text-xl text-white font-semibold">
                            Give Up?
                          </p>
                          <p className="text-white">
                            Are you sure you want to give up this job? If you
                            proceed, you will no longer be associated with this
                            job.
                          </p>
                          <button
                            className=" bg-transparent rounded-lg border-2 border-[black] px-3 py-2 "
                            onClick={closegiveupModal}
                          >
                            Cancel
                          </button>
                          <button className="bg-[black] text-white px-4 py-3 rounded-lg ml-2 mt-5">
                            Give Up
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
