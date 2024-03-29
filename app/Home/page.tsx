"use client";
import React, { useEffect, useState } from "react";
import ProctedNav from "../Components/ProctedNav";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import Image from "next/image";
import Hero from "../../assets/Hero.png";
import Dash2 from "../../assets/Dash2.png";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/auth/authSlice";
import Navbar from "../Components/Navbar";

function Page() {
  const [address, setAddress] = useState("");
  const [did, setDid] = useState<string>();
  const dispatch = useDispatch();
  const router = useRouter();
  const [persona, setPersona] = useState<string>();
  const [resumeHave, setResumeHave] = useState(false);
  const [balance, setBalance] = useState("");

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover   bg-no-repeat min-h-screen">
      <Navbar did={did} persona={persona} balance={balance} />
      <div className="flex flex-col-reverse md:flex-row  justify-between items-center pt-5   md:pl-20">
        <div className="text-center md:pt-16 md:text-left pr-0">
          <p className="text-3xl md:text-6xl text-[#3498DB] font-bold text-white">
            Uniting Talent and Opportunity
          </p>
          <p className="text-lg px-10 md:px-0 md:w-[680px] break-words md:text-lg pt-5 text-[#C2D9FF]">
            {" "}
            Join a World of Opportunities and Innovation as a Developer in the
            GigHub. Your Skills, Your Terms, Your Future.
          </p>
          <div className="mt-8 ">
            {!did && !resumeHave ? (
              <>
                <Link shallow href="/Signup">
                  {" "}
                  <button className="bg-[#3498DB] mt-3 md:mt-0 text-white md:text-xl px-5 py-2 rounded-xl">
                    <span className="flex">
                      Get Started <AiOutlineArrowRight className="mt-1 ml-2" />{" "}
                    </span>
                  </button>
                </Link>
              </>
            ) : did && !resumeHave ? (
              <>
                <Link shallow href="/Signup">
                  {" "}
                  <button className="bg-[#3498DB] mt-3 md:mt-0 text-white md:text-xl px-5 py-2 rounded-xl">
                    <span className="flex">
                      Create On-Chain Resume{" "}
                      <AiOutlineArrowRight className="mt-1 ml-2" />{" "}
                    </span>
                  </button>
                </Link>
              </>
            ) : did && resumeHave ? (
              <>
                <Link shallow href="/AllGigs">
                  {" "}
                  <button className="bg-[#3498DB] mr-2 mt-3 md:mt-0 text-white md:text-xl px-5 py-2 rounded-xl">
                    <span className="flex">Explore Gigs</span>
                  </button>
                </Link>
                <Link shallow href="/PostedGigs">
                  {" "}
                  <button className="bg-[#3498DB] mt-3 md:mt-0 text-white md:text-xl px-5 py-2 rounded-xl">
                    <span className="flex">Post Gigs</span>
                  </button>
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-5 md:mt-0">
          <Image
            src={Hero}
            alt="Hero Image"
            className=" h-40 w-40 md:w-[650px] md:pt-2 md:mt-2 md:h-[520px]"
          />
        </div>
      </div>
      <Image src={Dash2} alt="Hero Image" className=" h-28 w-auto" />
    </div>
  );
}

export default Page;
