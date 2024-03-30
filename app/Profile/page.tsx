"use client";
import React, { useEffect, useState } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import ellipse from "../../assets/ellipse.svg";
import gig from "../../assets/gig.svg";
import dribble from "../../assets/dribble.svg";
import linkedin from "../../assets/linkedin.svg";
import github from "../../assets/github.svg";
import dev from "../../assets/dev.svg";
import below from "../../assets/below.svg";
import Image from "next/image";
import { BsShare } from "react-icons/bs";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import Modal from "../Components/EditProfileModel/Model";
import { useEthereum } from "../Components/DataContext";

const categories = [
  "Logo Design",
  "Graphic Design",
  "Video Design",
  "Content Writer",
  "Java Developer",
  "Backend Developer",
  "UI Developer",
];

const gigData = {
  id: 1,
  name: "Joeylene Rivera",
  role: "Web Developer",
  rating: "4.8",
  description:
    "A kiddo who uses Bootstrap and Laravel in web development. Currently playing around with design via Figma",
  image: gig,
  location: "Canada",
  email: "joeylenerivera@gmail.com",
  links: {
    dribble: "",
    linkedin: "",
    github: "",
    Dev: "",
  },
  skills: [
    "web design",
    "ui/ux design",
    "front end developer",
    "mobile app ui",
    "ui design",
  ],
};

function page() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const shareURL = `https://talentledger.vercel.app/${gigData.name}`;
  const { address, didData, balance, ipfsData, userrole } = useEthereum();
  console.log("add", address);
  console.log("did", didData);
  console.log("balance", balance);
  console.log("ipfsData", ipfsData);
  console.log("userrole", userrole);
  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Share TalentLayer",
          text: "Check out this awesome website!",
          url: shareURL,
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const EditProfile = () => {
    setIsModalOpen(true);
  };
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

  return (
    <div>
      <ProtectedNavbar />
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
      <div className="flex justify-center -space-x-5">
        <div className="flex justify-center mt-8">
          <div className="bg-[#B8F6FF] w-[320px] rounded-3xl">
            <div className="flex justify-center pt-8 pb-4 items-center">
              <img
                src={ipfsData?.profileImage ?? gigData.image}
                alt="home"
                className="h-24 rounded-full w-24"
              />
              <Image
                src={ellipse}
                alt="home"
                className="h-28 lg:h-[110px] ml-8 absolute w-auto"
              />
            </div>
            <p className="text-lg text-center font-bold">{ipfsData?.name}</p>
            <p className="text-center">{ipfsData?.designation}</p>
            <div
              onClick={handleShareClick}
              className="flex justify-center cursor-pointer hover:bg-black hover:text-white items-center space-x-2 border-2 text-sm border-[#141413] rounded-md mx-[95px] py-1 my-2"
            >
              <BsShare className="w-auto h-3 font-medium " />{" "}
              <p>Share Profile</p>
            </div>

            <p className="w-80 text-sm font-medium py-2 text-center px-5">
              {ipfsData?.description}
            </p>
            <p className="bg-black text-white  px-3 py-1 text-center rounded-lg text-sm mx-8">
              {ipfsData?.email}
            </p>
            {ipfsData?.links?.length > 0 ? (
              ipfsData.links.map((link) => (
                <div className="flex justify-center space-x-3 mt-3 ">
                  <Link href={link.behance}>
                    {" "}
                    <Image className="h-5 w-auto" src={dribble} alt="" />
                  </Link>
                  <Link href={link.linkedin}>
                    <Image className="h-5 w-auto" src={linkedin} alt="" />
                  </Link>
                  <Link href={link.github}>
                    <Image className="h-5 w-auto" src={github} alt="" />
                  </Link>
                  <Link href={link.portfolio}>
                    <Image className="h-5 w-auto" src={dev} alt="" />
                  </Link>
                </div>
              ))
            ) : (
              <></>
            )}
            <Image src={below} className="w-full" alt="" />
          </div>
        </div>
        <div>
          <MdEdit
            className="text-white cursor-pointer mt-5 bg-black p-2 rounded-full"
            size="2em"
            onClick={EditProfile}
          />
        </div>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default page;
