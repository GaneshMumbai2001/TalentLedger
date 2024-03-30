"use client";
import React, { useState } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import calendar from "../../assets/calendar.svg";
import expert from "../../assets/expert.svg";
import verified from "../../assets/verified.svg";
import dollar from "../../assets/dollar.svg";
import star from "../../assets/star.svg";
import profile from "../../assets/profile.svg";
import Image from "next/image";

const gigData = {
  id: 1,
  jobtitle: "Convert my mobile Figma UI to web UI",
  jobposted: "1",
  jobdescription1:
    "Develop responsive, user-friendly websites and web applications using modern web technologies such as HTML5, CSS3, JavaScript, and frameworks like React or Angular.",
  jobdescription2:
    "Stay up-to-date with emerging technologies and industry trends to continuously improve our products.",
  skills: ["web design", "ui/ux design", "front end developer"],
  totalPrice: 30,
  serviceFee: 0,
  youllReceive: 30,
  expertLevel: "Expert",
  fixedPrice: 30,
  projectDuration: "Less than a month",
  milestones: [
    {
      id: 1,
      description: "",
      date: "23-02-2024",
      status: "not yet started",
      paymentStatus: "unpaid",
    },
  ],
};

const applicantdata = [
  {
    id: 1,
    name: "Joeylene Rivera",
    role: "Senior Designer and Developer",
    rating: 5.0,
    reviews: 200,
    profileImg: profile,
    profileLink: "#",
  },
];

function page() {
  const [gig, setGig] = useState(gigData);
  const [milestone, setMilestone] = useState(gig.milestones[0]);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  const handleApplicantChange = (e) => {
    setSelectedApplicantId(Number(e.target.value));
  };

  const selectedApplicant = applicantdata.find(
    (applicant) => applicant.id === selectedApplicantId
  );

  const handleMilestoneChange = (e: any) => {
    const { name, value } = e.target;
    setMilestone({ ...milestone, [name]: value });
  };

  const estimatedPayment = gig.totalPrice - gig.serviceFee;

  return (
    <div className="pb-10">
      <ProtectedNavbar />
      <div className="my-5 mx-20">
        <p className="font-semibold text-2xl mt-5">Gig Details</p>
        <div className="flex  space-x-10">
          <div>
            <div className="bg-[#FBF4EE] px-5 py-5 rounded-lg mt-10">
              <p className="text-xl font-semibold">Applicant Details</p>
              <div className="flex space-x-5">
                <div className="mt-3">
                  <p className="text-sm font-semibold">Select Applicant</p>
                  <select
                    onChange={handleApplicantChange}
                    className="select text-sm text-[#747474] outline-none py-1 mt-3"
                  >
                    <option value="">Select an applicant</option>
                    {applicantdata.map((applicant) => (
                      <option key={applicant.id} value={applicant.id}>
                        {applicant.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedApplicant && (
                  <div className="flex space-x-8 items-center mt-4">
                    <div className="flex space-x-2">
                      <Image
                        src={selectedApplicant.profileImg}
                        alt=""
                        width="50"
                        height="50"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {selectedApplicant.name}
                        </p>
                        <p className="text-[#747474] text-[12px]">
                          {selectedApplicant.role}
                        </p>
                        <div className="text-sm flex space-x-2 items-center">
                          <Image src={star} alt="" className="w-auto h-3" />
                          <p className="text-sm font-semibold">
                            {selectedApplicant.rating}
                          </p>
                          <span className="text-[#747474]">
                            ({selectedApplicant.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="bg-[#00CBA0] text-sm font-semibold px-6 py-2 rounded-lg">
                        View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#FBF4EE] px-5 py-5 rounded-lg mt-10">
              <p className="text-xl font-semibold">Job Details</p>
              <p className="text-lg mt-3 font-semibold">{gig.jobtitle}</p>
              <p className="text-sm text-[#747474] mt-1">
                Posted {gig.jobposted} hour ago
              </p>
              <p className="text-sm mt-5">{gig.jobdescription1}</p>
              <p className="text-sm mt-2">{gig.jobdescription2}</p>
              <p className="text-sm mt-2">Requirements:</p>
              <div className="border border-t-[#DCDCDC] mt-5"></div>
              <p className="mt-5 text-lg font-semibold">Skills and expertise</p>
              <div className="px-3 py-2 flex flex-wrap gap-3 uppercase">
                {gig.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 text-sm py-1 font-medium bg-[white] rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#FBF4EE] px-5 py-5 rounded-lg mt-10">
              <p className="font-semibold text-2xl mt-5">Price</p>
              <div className="flex mt-3 justify-between">
                <p className="text-md font-semibold">Total price of project</p>
                <p className="text-lg font-semibold">${gig.totalPrice}</p>
              </div>
              <p className="text-sm mt-2">
                This includes all milestones, and is the amount your client will
                see.
              </p>
              <div className="flex mt-3 justify-between">
                <p className="text-md font-semibold">100% Free Service Fee</p>
                <p className="text-lg font-semibold">${gig.serviceFee}</p>
              </div>
              <div className="flex mt-3 justify-between">
                <p className="text-md font-semibold">You’ll Receive</p>
                <p className="text-lg font-semibold">
                  ${estimatedPayment.toFixed(2)}
                </p>
              </div>
              <p className="text-sm mt-2">
                Your estimated payment, after service fees.
              </p>
            </div>
            <div className="bg-[#FBF4EE] px-5 py-5 rounded-lg mt-10">
              <p className="font-semibold text-2xl mt-5">Milestones</p>
              <p className="text-md mt-3 font-semibold">
                How many milestones do you want to include?
              </p>

              <div className="mt-3 flex space-x-5 items-end ">
                <div>
                  <p className="text-sm mt-3 font-semibold">Milestones</p>
                  <input
                    type="date"
                    name="date"
                    value={milestone.date}
                    onChange={handleMilestoneChange}
                    className="input outline-none"
                  />
                </div>
                <div>
                  <p className="text-sm mt-3 font-semibold">
                    Milestones Description
                  </p>
                  <input
                    type="text"
                    name="description"
                    value={milestone.description}
                    onChange={handleMilestoneChange}
                    className="input outline-none"
                  />
                </div>
                <div>
                  <p className="text-sm mt-3 font-semibold">
                    Milestones Status
                  </p>
                  <select
                    name="status"
                    value={milestone.status}
                    onChange={handleMilestoneChange}
                    className="select outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Not yet started">Not yet started</option>
                    <option value="In process">In process</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <p className="text-[#F24E4D] bg-[#FFE5E4] px-4 py-1 rounded-full">
                  {milestone.paymentStatus}
                </p>
                <button className="text-[#FFC830] bg-[#FCEAC2] px-4 py-1 rounded-full">
                  {" "}
                  Dispute
                </button>
                <button className="border border-[#DCDCDC] px-8 rounded-lg font-medium py-2 text-sm">
                  {" "}
                  Reject
                </button>
                <button className="border flex space-x-2 items-center bg-[#00CBA0] px-8 rounded-lg font-medium py-2 text-sm">
                  <p>Approve</p> <Image src={verified} alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-[#FBF4EE] w-72 h-full px-5 py-5 rounded-lg mt-10">
            <div className="flex space-x-2 items-start">
              <Image src={expert} alt="" className="mt-2" />
              <div>
                <p className="text-lg font-semibold">Expert</p>
                <p className="text-sm text-[#747474]">Experience Level</p>
              </div>
            </div>
            <div className="flex my-3 space-x-2 items-start">
              <Image src={dollar} alt="" className="mt-2" />
              <div>
                <p className="text-lg font-semibold">${gig.totalPrice}</p>
                <p className="text-sm text-[#747474]">Fixed Price</p>
              </div>
            </div>
            <div className="flex space-x-2 items-start">
              <Image src={calendar} alt="" className="mt-2" />
              <div>
                <p className="text-md font-bold">Less than a month</p>
                <p className="text-sm text-[#747474]">Project Duration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
