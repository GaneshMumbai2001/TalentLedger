"use client";
import React, { useState } from "react";
import ProctedNav from "../Components/ProctedNav";
import Link from "next/link";
import { AiOutlineArrowRight, AiOutlineLeft } from "react-icons/ai";
import Image from "next/image";
import Hero from "../../assets/Hero.png";
import ToggleButton from "react-toggle-button";
import Particle from "../Components/Particles";

interface Applicant {
  id: number;
  name: string;
  toggle: boolean;
}

const requesteeData: Applicant[] = [
  { id: 1, name: "JohnSmit.eth", toggle: false },
  { id: 2, name: "JohnSmit.eth", toggle: false },
  { id: 3, name: "JohnSmit.eth", toggle: false },
  { id: 4, name: "JohnSmit.eth", toggle: false },
];
const granteeData: Applicant[] = [
  { id: 1, name: "JohnSmit.eth", toggle: true },
  { id: 2, name: "JohnSmit.eth", toggle: false },
];

function Page() {
  const [grantees, setGrantees] = useState(granteeData);
  const [requestees, setRequestees] = useState(requesteeData);

  const handleGrantToggle = (id: number) => {
    setGrantees((previousGrantees) => {
      const newGrantees = previousGrantees.map((applicant) =>
        applicant.id === id
          ? { ...applicant, toggle: !applicant.toggle }
          : applicant
      );
      return newGrantees;
    });
  };
  const handleReqToggle = (id: number) => {
    setRequestees((previousRequestees) => {
      const newRequestees = previousRequestees.map((applicant) =>
        applicant.id === id
          ? { ...applicant, toggle: !applicant.toggle }
          : applicant
      );
      return newRequestees;
    });
  };

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen">
      <ProctedNav />
      <div className="flex flex-col-reverse md:flex-row  justify-between items-center pt-5 md:pt-12  md:pl-20">
        <Link shallow href="/Home">
          <p className="text-sm text-white font-semibold flex">
            <AiOutlineLeft className="mt-1 text-sm mr-1" /> Go Back
          </p>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row py-10 px-5 md:px-0 md:space-x-28 justify-center">
        <div>
          <p className="text-3xl mb-5 font-semibold text-[#3498DB]">
            Requestee
          </p>
          <div className="overflow-auto mx-1 scrollable-list  h-96 md:h-auto md:max-h-[450px] flex flex-col text-white md:space-y-3 px-4 md:px-10">
            {requestees.map((applicant) => (
              <div
                key={applicant.id}
                className="flex px-8 items-center justify-between py-2 applicantlist border border-[#FFF] rounded-lg space-x-4 my-2 md:space-x-16"
              >
                <p>{applicant.id}.</p>
                <p>{applicant.name}</p>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#3498DB] font-bold">
                    {applicant.toggle ? <p>ON</p> : <p>OFF</p>}
                  </span>
                  <ToggleButton
                    key={applicant.id}
                    value={applicant.toggle}
                    onToggle={() => handleReqToggle(applicant.id)}
                    thumbStyle={{
                      borderRadius: "50%",
                      backgroundColor: applicant.toggle ? "#3498DB" : "#FFF",
                    }}
                    trackStyle={{
                      borderRadius: 20,
                      backgroundColor: "",
                      paddingLeft: "5px",
                      paddingRight: "15px",
                      height: "30px",
                      border: applicant.toggle
                        ? "2px solid #3498DB"
                        : "2px solid #FFF",
                      boxSizing: "border-box",
                    }}
                    thumbAnimateRange={[2, 30]}
                    activeLabel={""}
                    inactiveLabel={""}
                    colors={{
                      activeThumb: { base: "#3498DB" },
                      inactiveThumb: { base: "white" },
                      active: {
                        base: "rgba(255, 255, 255, 0.20);",
                        hover: "rgba(255, 255, 255, 0.20);",
                      },
                      inactive: {
                        base: "rgba(255, 255, 255, 0.20);",
                        hover: "rgba(255, 255, 255, 0.20);",
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-3xl mb-5 font-semibold text-[#3498DB]">Grantee</p>
          <div className="overflow-auto mx-1 scrollable-list  h-96 md:h-auto md:max-h-[450px] flex flex-col text-white md:space-y-3 px-4 md:px-10">
            {grantees.map((applicant) => (
              <div
                key={applicant.id}
                className="flex px-8 items-center justify-between py-2 applicantlist border border-[#FFF] rounded-lg space-x-4 my-2 md:space-x-16"
              >
                <p>{applicant.id}.</p>
                <p>{applicant.name}</p>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#3498DB] font-bold">
                    {applicant.toggle ? <p>ON</p> : <p>OFF</p>}
                  </span>
                  <ToggleButton
                    key={applicant.id}
                    value={applicant.toggle}
                    onToggle={() => handleGrantToggle(applicant.id)}
                    thumbStyle={{
                      borderRadius: "50%",
                      backgroundColor: applicant.toggle ? "#3498DB" : "#FFF",
                    }}
                    trackStyle={{
                      borderRadius: 20,
                      backgroundColor: "",
                      paddingLeft: "5px",
                      paddingRight: "15px",
                      height: "30px",
                      border: applicant.toggle
                        ? "2px solid #3498DB"
                        : "2px solid #FFF",
                      boxSizing: "border-box",
                    }}
                    thumbAnimateRange={[2, 30]}
                    activeLabel={""}
                    inactiveLabel={""}
                    colors={{
                      activeThumb: { base: "#3498DB" },
                      inactiveThumb: { base: "white" },
                      active: {
                        base: "rgba(255, 255, 255, 0.20);",
                        hover: "rgba(255, 255, 255, 0.20);",
                      },
                      inactive: {
                        base: "rgba(255, 255, 255, 0.20);",
                        hover: "rgba(255, 255, 255, 0.20);",
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
