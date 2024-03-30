"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import contributor1 from "../../assets/contributor1.svg";
import contributor2 from "../../assets/contributor2.svg";
import contributor3 from "../../assets/contributor3.svg";
import star from "../../assets/star.svg";
import ProtectedNavbar from "../Components/ProctedNavbar";
import Link from "next/link";
import { ethers } from "ethers";

import { getDIDInfos } from "@/config/BlockchainServices";
import { useEthereum } from "../Components/DataContext";

interface DeveloperData {
  title: string;
  contributors: any;
  rating: number;
}

const developersData: DeveloperData[] = [
  {
    title: "Javascript Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "PHP Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "IOS Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "UI Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "Backend Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "Frontend Developers",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "Animation",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
  {
    title: "Video Editor",
    contributors: [contributor1, contributor2, contributor3],
    rating: 4.8,
  },
];

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredDevelopers = developersData.filter((dev) =>
    dev.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-10">
      <ProtectedNavbar onSearch={setSearchTerm} />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  gap-4 md:mx-8 mx-5 lg:mx-12 xl:mx-16 2xl:mx-20">
        {filteredDevelopers.length > 0 ? (
          filteredDevelopers.map((dev, index) => (
            <Link href={`/Dashboard/${index}?role=${dev.title}`}>
              <div
                key={index}
                className="w-80 flex flex-col space-y-5 px-8 py-8 rounded-lg bg-[#FBF4EE]"
              >
                <p className="text-xl font-bold">{dev.title}</p>
                <div className="flex -space-x-6">
                  {dev.contributors.map((contributor: any, index: any) => (
                    <Image
                      key={index}
                      src={contributor}
                      alt=""
                      width={50}
                      height={50}
                      className="z-10 relative"
                    />
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Image src={star} alt="" width={20} height={20} />
                  <p>{`${dev.rating}/5 average ratings`}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-lg font-bold">
            No available data for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
