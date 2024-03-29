"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import gigdata from "../../assets/gigdata.svg";
import paymenttick from "../../assets/paymenttick.svg";
import star from "../../assets/blackstar.svg";
import heart from "../../assets/heart.svg";
import leftarrow from "../../assets/leftarrow.svg";
import rightarrow from "../../assets/rightarrow.svg";
import ProtectedNavbar from "../Components/ProctedNavbar";
import heartOutline from "../../assets/heart.svg";
import heartFilled from "../../assets/heartFilled.svg";
import JobModel from "../Components/JobModel/Model";
import { getDIDInfos } from "@/config/BlockchainServices";
import { ethers } from "ethers";
import { useEthereum } from "../Components/DataContext";

type JobIdType = string | number;

const categories = [
  "Logo Design",
  "Graphic Design",
  "Video Design",
  "Content Writer",
  "Java Developer",
  "Backend Developer",
  "UI Developer",
];

const Jobs = [
  {
    id: 1,
    title: "Need a designer",
    description:
      "We are looking for a skilled and experienced website designer and developer to create a visually appealing..",
    paymentVerified: true,
    rating: 4.5,
    reviews: 1000,
    category: "Graphic Design",
    skills: ["web design", "ui/ux design", "front end developer"],
  },
  {
    id: 2,
    title: "Java Developer Needed",
    description:
      "Seeking an experienced Java developer to work on a variety of projects in a dynamic, fast-paced environment.",
    paymentVerified: true,
    rating: 4.7,
    reviews: 850,
    category: "Java Developer",
  },
  {
    id: 3,
    title: "Freelance Content Writer",
    description:
      "Looking for a creative content writer to produce engaging and original content for our blog and social media channels.",
    paymentVerified: false,
    rating: 4.3,
    reviews: 500,
    category: "Content Writer",
  },
  {
    id: 4,
    title: "Senior UI/UX Designer",
    description:
      "Hiring a senior UI/UX designer to redesign our mobile application for a better user experience.",
    paymentVerified: true,
    rating: 4.8,
    reviews: 1200,
    category: "UI Developer",
  },
  {
    id: 5,
    title: "Digital Marketing Specialist",
    description:
      "Need a digital marketing specialist with experience in SEO, PPC, and social media to increase our online presence.",
    paymentVerified: false,
    rating: 4.2,
    reviews: 300,
    category: "Digital Marketing",
  },
  {
    id: 6,
    title: "Backend Developer for Startup",
    description:
      "Startup looking for a backend developer proficient in Node.js and MongoDB to join our tech team.",
    paymentVerified: true,
    rating: 4.6,
    reviews: 750,
    category: "Backend Developer",
  },
  {
    id: 7,
    title: "Video Editor for YouTube Channel",
    description:
      "Seeking a creative video editor with experience in Adobe Premiere Pro and After Effects to edit our weekly YouTube videos.",
    paymentVerified: true,
    rating: 4.4,
    reviews: 620,
    category: "Video Design",
  },
];

function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [likedJobs, setLikedJobs] = useState<JobIdType[]>([]);

  const toggleLike = (jobId: JobIdType) => {
    setLikedJobs((prevLikedJobs) => {
      const isAlreadyLiked = prevLikedJobs.includes(jobId);
      const updatedLikedJobs = isAlreadyLiked
        ? prevLikedJobs.filter((id) => id !== jobId)
        : [...prevLikedJobs, jobId];
      console.log("Favorites: ", updatedLikedJobs);
      return updatedLikedJobs;
    });
  };

  const isLiked = (jobId: JobIdType) => likedJobs.includes(jobId);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("Relevance");
  const [filteredJobs, setFilteredJobs] = useState(Jobs);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const [category, setCategory] = useState("");
  const [gigDetails, setGigDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };
  const { address, didData, balance, ipfsData, userrole } = useEthereum();
  console.log("add", address);
  console.log("did", didData);
  console.log("balance", balance);
  console.log("ipfsData", ipfsData);
  console.log("userrole", userrole);

  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);
  const handleSortChange = (event: any) => {
    const { value } = event.target;
    setSortOption(value);
  };
  useEffect(() => {
    let updatedJobs = [...Jobs].filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory) {
      updatedJobs = updatedJobs.filter(
        (job) => job.category === selectedCategory
      );
    }

    if (sortOption === "rating") {
      updatedJobs.sort((a, b) => b.rating - a.rating);
    }

    setFilteredJobs(updatedJobs);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  const handleSearchChange = (searchTerm: any) => {
    setSearchTerm(searchTerm);
  };

  return (
    <div className="pb-10">
      <ProtectedNavbar onSearch={handleSearchChange} />
      <div className="bg-[#FBF4EE] flex  items-center px-20 text-md font-bold py-3 space-x-5">
        <p>Suggested</p>
        {categories.map((category) => (
          <p
            key={category}
            className={`px-4 py-2 cursor-pointer rounded-full ${
              selectedCategory === category ? "bg-[#00CBA0]" : "bg-white"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </p>
        ))}
      </div>
      <div>
        <p className="px-20 text-xl py-5">
          Result for{" "}
          <span className="text-2xl font-bold">
            {searchTerm || selectedCategory || "All Jobs"}
          </span>
        </p>
      </div>
      <div className="flex px-20 justify-between">
        <div className="flex space-x-5">
          <select
            className="outline-none px-3 pr-4 py-3 font-semibold rounded-lg border border-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="webDevelopment">Web Development</option>
            <option value="graphicDesign">Graphic Design</option>
            <option value="digitalMarketing">Digital Marketing</option>
          </select>
          <select
            className="outline-none px-3 pr-4 py-3 font-semibold rounded-lg border border-black"
            value={gigDetails}
            onChange={(e) => setGigDetails(e.target.value)}
          >
            <option value="">Gig Details</option>
            <option value="fullProject">Full Project</option>
            <option value="quickTask">Quick Task</option>
            <option value="consultation">Consultation</option>
          </select>
          <select
            className="outline-none px-3 pr-4 py-3 font-semibold rounded-lg border border-black"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Budget</option>
            <option value="under500">Under $500</option>
            <option value="500to1000">$500 - $1000</option>
            <option value="above1000">Above $1000</option>
          </select>
          <select
            className="outline-none px-3 pr-4 py-3 font-semibold rounded-lg border border-black"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          >
            <option value="">Delivery Time</option>
            <option value="under1Week">Under 1 Week</option>
            <option value="1to2Weeks">1 to 2 Weeks</option>
            <option value="above2Weeks">Above 2 Weeks</option>
          </select>
        </div>
        <div>
          <p>
            Sort:{" "}
            <select
              className="outline-none px-3 py-2 rounded-lg"
              onChange={(e) => handleSortChange(e)}
              value={sortOption}
            >
              <option value="relevance">Relevance</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </p>
        </div>
      </div>

      {currentJobs.length > 0 ? (
        <div className="flex justify-center lg:px-24 py-6 gap-4 xl:gap-8 flex-wrap">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#FBF4EE] w-[360px] py-6 px-5 rounded-lg m-2 relative"
            >
              <Image
                src={gigdata}
                alt="gigdata"
                layout="responsive"
                width={350}
                height={200}
              />
              <div
                onClick={() => toggleLike(job.id)}
                className="cursor-pointer absolute top-6 right-6 p-2"
              >
                <Image
                  src={isLiked(job.id) ? heartFilled : heartOutline}
                  alt="like"
                  width={24}
                  height={24}
                />
              </div>

              <p
                onClick={() => handleJobClick(job)}
                className="text-xl cursor-pointer hover:underline font-bold pt-4"
              >
                {job.title}
              </p>
              <p className="text-[#747474] py-2 w-80">{job.description}</p>
              <div className="flex justify-between">
                <div className="flex space-x-2 items-center">
                  <Image
                    className="w-auto h-5"
                    src={paymenttick}
                    alt="payment verified"
                  />
                  <p className="text-xl font-semibold">Payment Verified</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <Image src={star} alt="" />
                  <p>
                    {job.rating}{" "}
                    <span className="text-[#747474]">({job.reviews}+)</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center px-20 py-6">
          No data found for the selected criteria.
        </p>
      )}
      <div className="px-16 pt-6 flex justify-between">
        <p className="text-[#4B4B4B] text-sm">
          Showing {indexOfFirstJob + 1}-
          {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
          {filteredJobs.length}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2"
          >
            <Image src={leftarrow} alt="Previous" /> <p>Previous</p>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number ? "bg-[#00CBA0] text-white" : "bg-white"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2"
          >
            <p>Next</p> <Image src={rightarrow} alt="Next" />
          </button>
        </div>
      </div>
      {selectedJob && (
        <JobModel isOpen={isModalOpen} job={selectedJob} onClose={closeModal} />
      )}
    </div>
  );
}

export default Page;
