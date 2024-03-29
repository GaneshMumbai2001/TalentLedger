"use client";
import ProtectedNavbar from "@/app/Components/ProctedNavbar";
import React, { useEffect, useState } from "react";
import home from "../../../assets/home.svg";
import chroneright from "../../../assets/chroneright.svg";
import ellipse from "../../../assets/ellipse.svg";
import gig from "../../../assets/gig.svg";
import star from "../../../assets/star.svg";
import below from "../../../assets/below.svg";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Modal from "../../Components/ProfileModel/Model";
import { useEthereum } from "@/app/Components/DataContext";

interface GigData {
  id: number;
  name: string;
  role: string;
  image: any;
  rating: string;
  description: string;
  location: string;
  skills: string[];
}

const gigData = [
  {
    id: 1,
    name: "Joeylene Rivera",
    role: "Web Developer",
    rating: "4.8",
    description:
      "A kiddo who uses Bootstrap and Laravel in web development. Currently playing around with design via Figma",
    image: gig,
    location: "Canada",
    skills: [
      "web design",
      "ui/ux design",
      "front end developer",
      "mobile app ui",
      "ui design",
    ],
  },
  {
    id: 2,
    name: "Alex Johnson",
    role: "Graphic Designer",
    rating: "4.7",
    description:
      "Passionate about creating engaging visuals with Adobe Suite. Loves typography and color theory.",
    image: gig,
    location: "Canada",
    skills: [
      "web design",
      "ui/ux design",
      "front end developer",
      "mobile app ui",
      "ui design",
    ],
  },
  {
    id: 3,
    name: "Samantha Bloom",
    role: "Digital Marketer",
    rating: "4.9",
    description:
      "Expert in SEO and social media strategy. Helps brands grow their online presence and reach.",
    image: gig,
    location: "Canada",
    skills: [
      "web design",
      "ui/ux design",
      "front end developer",
      "mobile app ui",
      "ui design",
    ],
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Software Engineer",
    rating: "4.6",
    description:
      "Specializes in developing scalable web applications using React and Node.js. Enthusiast of cloud technologies.",
    image: gig,
    location: "Canada",
    skills: [
      "web design",
      "ui/ux design",
      "front end developer",
      "mobile app ui",
      "ui design",
    ],
  },
];

const page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<GigData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const filteredDevelopers = gigData.filter((dev) =>
    dev.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleViewMore = (dev: GigData) => {
    setSelectedDeveloper(dev);
    setIsModalOpen(true);
  };
  const { address, didData, balance, ipfsData, userrole, getusers, gigdata } =
    useEthereum();
  const [matchingDevelopers, setMatchingDevelopers] = useState([]);
  useEffect(() => {
    async function matchDevelopersByLanguage() {
      let matches = [];
      for (const category of gigdata) {
        let categoryMatch = false;
        for (const contributor of category.contributors) {
          const userData = await fetchGitHubUserData(contributor);
          const topThreeLanguages = getTopThreeLanguages(
            userData?.user?.languagePercentages
          );
          if (topThreeLanguages.includes(searchTerm)) {
            categoryMatch = true;
            break;
          }
        }

        if (categoryMatch) {
          matches.push(category);
        }
      }
      setMatchingDevelopers(matches);
    }
    if (searchTerm) {
      matchDevelopersByLanguage();
    }
  }, [searchTerm]);

  async function fetchGitHubUserData(username) {
    const response = await fetch(
      `http://localhost:8000/api/user/${username}/repos`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user data");
    }
    const userData = await response.json();
    return userData;
  }

  function getTopThreeLanguages(languagePercentages) {
    if (
      typeof languagePercentages !== "object" ||
      languagePercentages === null
    ) {
      console.error("Invalid languagePercentages:", languagePercentages);
      return [];
    }

    const languagesArray = Object.entries(languagePercentages);
    languagesArray.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    const topThreeLanguages = languagesArray.slice(0, 3);
    const topThreeLanguageNames = topThreeLanguages.map(
      ([language, _]) => language
    );

    return topThreeLanguageNames;
  }

  useEffect(() => {
    async function getdata() {
      for (const username of gigdata) {
        const userData = await fetchGitHubUserData(username);
        console.log("Full User Data:", userData);
        const topThreeLanguages = getTopThreeLanguages(
          userData?.user?.languagePercentages
        );
        console.log(
          `Top 3 languages for ${userData?.user?.login}:`,
          topThreeLanguages
        );
      }
    }
    getdata();
  }, [gigdata]);

  console.log("address", address);
  console.log("getalldidinfo", getusers);
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

  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="pb-10">
      <ProtectedNavbar onSearch={setSearchTerm} />
      <div className="px-20  space-x-3 flex items-center mt-12">
        <Link href="/Dashboard">
          <Image src={home} alt="home" className="h-6 w-auto" />
        </Link>
        <Image src={chroneright} alt="home" className="h-4 w-auto" />
        <p className="text-[#747474] text-md  uppercase">{role}</p>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  gap-4 md:mx-8 mx-5 lg:mx-12 xl:mx-16 2xl:mx-20">
        {filteredDevelopers.length > 0 ? (
          filteredDevelopers.map((dev, index) => (
            <div key={index} className="bg-[#B8F6FF] w-[320px] rounded-3xl">
              <div className="flex justify-center pt-8 pb-4 items-center">
                <Image src={dev.image} alt="home" className="h-24 w-auto" />
                <Image
                  src={ellipse}
                  alt="home"
                  className="h-28 lg:h-[110px] ml-8 absolute w-auto"
                />
              </div>
              <p className="text-lg text-center font-bold">{dev.name}</p>
              <p className="text-center">{dev.role}</p>
              <div className="flex justify-center items-center space-x-2">
                <Image src={star} alt="home" className="h-4  w-auto" />
                <p>{dev.rating}/5 </p>
              </div>
              <p className="w-80 text-sm py-2 text-center px-5">
                {dev.description}
              </p>
              <button
                onClick={() => handleViewMore(dev)}
                className="bg-black mx-auto block mt-3 px-8 py-3 rounded-lg text-white"
              >
                View More
              </button>
              <Image src={below} className="w-full" alt="" />
            </div>
          ))
        ) : (
          <div className="text-lg font-bold">
            No available data for "{searchTerm}"
          </div>
        )}
      </div>
      {isModalOpen && selectedDeveloper && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedDeveloper}
        />
      )}
    </div>
  );
};

export default page;
