"use client";
import React, { useState } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import { FaArrowRight, FaPlus } from "react-icons/fa";

function Page() {
  const [gig, setGig] = useState("");
  const [timeline, setTimeline] = useState("");
  const [pay, setPay] = useState("");
  const [skills, setSkills] = useState("");
  const [summary, setSummary] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([
    "HTML",
    "CSS",
    "Adobe Photoshop",
    "Angular",
  ]);

  const handleSubmit = () => {
    console.log({ gig, timeline, pay, skills, summary });
  };

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(skills ? `${skills}, ${skill}` : skill);
    }
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  return (
    <div>
      <ProtectedNavbar />
      <div className="mt-8">
        <p className="text-3xl font-bold text-center">Post Gig</p>
        <div className="flex justify-center my-3">
          <div className="border border-[#DCDCDC] rounded-xl px-5 py-5">
            <div className="flex gap-2 flex-col">
              <div>
                <label className="text-sm text-[#747474]">Enter Gigs*</label>
                <input
                  value={gig}
                  onChange={(e) => setGig(e.target.value)}
                  className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-[#747474]">
                  Enter the timeline
                  <span className="text-black font-semibold ml-1 text-[12px]">
                    (in Months)
                  </span>
                </label>
                <input
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-[#747474]">
                  How much would you pay*
                </label>
                <input
                  value={pay}
                  onChange={(e) => setPay(e.target.value)}
                  className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-[#747474]">
                  Skills Required*
                </label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                />
              </div>
              <div>
                {suggestedSkills.length > 0 && <label>Suggested Skills</label>}

                <div className="text-sm flex space-x-4">
                  {suggestedSkills.map((skill, index) => (
                    <p
                      key={index}
                      onClick={() => handleAddSkill(skill)}
                      className="bg-[#DCDCDC] cursor-pointer flex space-x-2 px-3 py-1 rounded-full font-semibold items-center"
                    >
                      <FaPlus className="text-[#00CBA0]" />
                      <span> {skill} </span>
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-[#747474]">Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full h-20 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={handleSubmit}
            className="bg-[#00CBA0] space-x-2 flex items-center px-6 py-2 rounded-lg"
          >
            <span>Next</span> <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
