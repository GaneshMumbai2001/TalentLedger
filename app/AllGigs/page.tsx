"use client";
import React, { useState, useEffect } from "react";
import ProctedNav from "../Components/ProctedNav";
import Link from "next/link";
import { AiFillPlusCircle, AiOutlineDown } from "react-icons/ai";
import Image from "next/image";
import Dicons from "../../assets/3dicons.png";
import { ethers } from "ethers";
import Particle from "../Components/Particles";
import axios from "axios";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { CheckTokenBalance } from "@/config/BlockchainServices";

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
  const [gigs, setGigs] = useState<Gig[]>([]);

  const [gigsData, setgigsData] = useState<Gig[] | undefined>();

  const token = useSelector((state: RootState) => state.auth.token);
  const [did, setDid] = useState("");
  const [persona, setPersona] = useState<string>();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
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
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getGigsByUserId = async () => {
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
      return response.data;
    } catch (error) {
      console.error("Error fetching gigs:", error);
      throw error;
    }
  };

  useEffect(() => {
    getGigsByUserId();
  }, []);

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen pb-10">
      <Navbar did={did} persona={persona} balance={balance} />
      <div className="flex flex-row justify-between items-center pt-5 px-10 md:pt-10 md:px-32">
        <button
          onClick={getGigsByUserId}
          className="text-white text-3xl font-bold"
        >
          All Gigs
        </button>
        <Link shallow href="/PostGig" passHref>
          <p className="bg-[#3498DB] text-white text-xl px-3 py-2 rounded-xl flex justify-center items-center">
            <AiFillPlusCircle className="mr-2" /> Post Gig
          </p>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:mx-28 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mt-5 px-4 md:px-0">
        {gigsData?.map((gig) => (
          <div
            key={gig._id}
            className="gigcard flex flex-col border h-full w-full max-w-sm mx-auto rounded-2xl text-center border-gray-200 bg-white"
          >
            <div className="flex-grow px-4 pt-3">
              <p className="text-lg  mx-3 text-white font-semibold">
                {gig.title}
              </p>
            </div>
            <p className="text-center text-sm text-white font-semibold">
              created by{" "}
              {ethers.utils
                .toUtf8String(gig.didOfPosted)
                .replace(/[^a-zA-Z0-9]/g, "")}
            </p>
            <div className="flex justify-center space-x-3 my-2">
              <p className="text-xl text-white font-bold">{gig.budget} Matic</p>
              <p className="text-white">•</p>
              <p className="text-[white] font-semibold">
                {gig.applicants.length} applicants
              </p>
            </div>
            <Link shallow href={`/AllGigs/${gig._id}`} passHref>
              <button className="text-center rounded-b-2xl w-full py-2 text-white bg-[#3498DB]">
                Apply Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
