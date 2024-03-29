"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo3.svg";
import { LuFileSpreadsheet } from "react-icons/lu";
import profile from "../../assets/profile.svg";
import {
  FaArrowRight,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";

interface ProtectedNavbarProps {
  onSearch?: (searchTerm: string) => void;
}

function ProtectedNavbar({ onSearch }: ProtectedNavbarProps) {
  const [activeLink, setActiveLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: "About Us", id: "about" },
    { name: "Find Gigs", id: "gigs" },
    { name: "Contact Us", id: "contact" },
  ];

  const handleSearchChange = (e: any) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="relative ">
      <div className="flex pt-4 px-16 justify-between items-center">
        <div className="relative  flex space-x-16 items-center">
          <Image src={logo} alt="logo" />
          <input
            type="text"
            placeholder="What service are you looking for today?"
            className="border w-96 py-2 md:block hidden rounded-lg pl-2 pr-10 border-[#DCDCDC] outline-none"
            onChange={handleSearchChange}
            value={searchTerm}
          />
          <FaArrowRight className="text-white md:block hidden text-3xl p-2 bg-black rounded-full absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" />
        </div>
        <div className="md:block hidden">
          <div className="flex text-lg font-bold space-x-14 items-center ">
            {navLinks.map((link) => (
              <p
                key={link.id}
                className={`hover:text-[#00CBA0] cursor-pointer ${
                  activeLink === link.id ? "text-[#00CBA0]" : ""
                }`}
                onClick={() => setActiveLink(link.id)}
              >
                {link.name}
              </p>
            ))}
            <div
              onClick={toggleProfileDropdown}
              className="relative cursor-pointer"
            >
              <Image src={profile} alt="profile" />
              {isProfileDropdownOpen && (
                <div className="absolute -right-4 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  <Link
                    href="/Profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-3" /> Profile
                  </Link>
                  <Link
                    href="/Manage"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LuFileSpreadsheet className="mr-3" /> Manage Gigs
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3" /> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="md:hidden flex items-center"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? (
            <FaTimes className="text-3xl" />
          ) : (
            <FaBars className="text-3xl" />
          )}
        </div>
      </div>
      {isNavOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center space-y-8 md:hidden">
          {navLinks.map((link) => (
            <p
              key={link.id}
              className={`text-white hover:text-[#00CBA0] text-xl cursor-pointer ${
                activeLink === link.id ? " text-[#00CBA0]" : ""
              }`}
              onClick={() => {
                setActiveLink(link.id);
                setIsNavOpen(false);
              }}
            >
              {link.name}
            </p>
          ))}
          <Image
            src={profile}
            alt="profile"
            className="cursor-pointer"
            width={50}
            height={50}
          />
        </div>
      )}
      <div className="border-t-2 w-full border-[#DCDCDC] mt-4"></div>
    </div>
  );
}

export default ProtectedNavbar;
