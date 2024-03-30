"use client";
import React, { useState } from "react";
import ProtectedNavbar from "@/app/Components/ProctedNavbar";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import profile from "../../../../assets/profile.svg";
import call from "../../../../assets/call.svg";
import videocall from "../../../../assets/videocall.svg";
import threedots from "../../../../assets/threedots.svg";
import { IoSend } from "react-icons/io5";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Page() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const designation = searchParams.get("designation");
  const image = searchParams.get("image");
  console.log("user", user);

  const [chat, setChat] = useState([
    {
      id: 1,
      text: "Hello! I saw your listing for the graphic design gig. Is it still available?",
      sender: "me",
      timestamp: "9:15 AM",
    },
    {
      id: 2,
      text: "Hi there! Yes, the gig is still open. Do you have any portfolio to share?",
      sender: "provider",
      timestamp: "9:20 AM",
    },
    {
      id: 3,
      text: "Absolutely, I can send over my portfolio link. I've worked on similar projects before.",
      sender: "me",
      timestamp: "9:22 AM",
    },
    {
      id: 4,
      text: "Great! Please send it over. Also, do you have any specific questions about the gig?",
      sender: "provider",
      timestamp: "9:25 AM",
    },
    {
      id: 5,
      text: "Here's the link to my portfolio [portfolio link]. And yes, I was wondering about the project timeline?",
      sender: "me",
      timestamp: "9:27 AM",
    },
    {
      id: 6,
      text: "Thanks for sharing. We're looking to complete the project in about 4 weeks. Does that fit with your schedule?",
      sender: "provider",
      timestamp: "9:30 AM",
    },
  ]);
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  const suggestedReplies = [
    "No",
    "Something else",
    "Yes, that’s correct",
    "Thanks",
  ];

  const handleSuggestedClick = (text: string) => {
    setMessage(text);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: chat.length + 1,
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChat([...chat, newMessage]);
    setMessage("");
  };

  return (
    <div className="pb-10">
      <ProtectedNavbar />
      <div className="mx-20 mt-8 flex justify-center space-x-10">
        <div>
          <Link className="flex items-center mt-5 space-x-2" href="/Dashboard">
            <FaArrowLeft />
            <p className="font-medium">Back</p>
          </Link>
        </div>
        <div className="w-[700px] px-5 py-5 border-2 rounded-lg border-[#DCDCDC] flex flex-col justify-between h-[520px]">
          <div className="flex justify-between">
            <div className="flex space-x-3 items-center">
              <Image src={profile} alt="" />
              <p className="text-lg font-medium">{user}</p>
            </div>
            <div className="flex space-x-8">
              <Image src={call} alt="" />
              <Image src={videocall} alt="" />
              <Image src={threedots} alt="" />
            </div>
          </div>
          <div className="overflow-auto px-1 mt-5">
            {chat.map((message) => (
              <div
                key={message.id}
                className={`flex items-end space-x-1 ${
                  message.sender === "me"
                    ? "justify-end text-[#FFFFFF]"
                    : "justify-start text-[#747474]"
                }`}
              >
                <Image
                  src={profile}
                  alt=""
                  className={`w-auto h-6 ${
                    message.sender === "me" ? "hidden" : ""
                  }`}
                />
                <div
                  className={`py-2 px-4 w-96 my-2 rounded-lg ${
                    message.sender === "me" ? "bg-[#00CBA0]" : "bg-[#F3F3F4]"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-right text-xs">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex overflow-auto space-x-2 pb-2">
              {suggestedReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedClick(reply)}
                  className="px-4 py-2 bg-[#FBF4EE] font-medium text-[12px] rounded-full"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form className="flex" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                <IoSend />
              </button>
            </form>
          </div>
        </div>
        <div className="w-72 px-5 py-5 border-2 h-[500px] rounded-lg border-[#DCDCDC] ">
          <p className="text-lg font-medium">Info</p>
          <div>
            <div className="flex mt-5 space-x-3">
              <Image src={profile} alt="" />
              <div>
                <p className="text-lg font-medium">{user}</p>
                <p className="text-[#747474] text-[12px]">{designation}</p>
                <p className="text-[10px] font-bold">India</p>
              </div>
            </div>
          </div>
          <button
            onClick={toggleSelection}
            className={`${
              isSelected ? "bg-[#00CBA0] text-white" : "text-[#747474] border"
            } mx-auto block mt-5 px-6 py-2 rounded-lg border-[#747474]`}
          >
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`${
                  isSelected ? "bg-white" : "bg-[#747474]"
                } rounded-full h-2 w-2`}
              ></div>
              <span>{isSelected ? "Selected" : "Select"}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
