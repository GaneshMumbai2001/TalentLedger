"use client";
import React, { useState } from "react";
import ProctedNav from "../Components/ProctedNav";
import { FaAngleUp } from "react-icons/fa";
import format from "date-fns/format";

const dummyData = [
  {
    name: "Paartha Jain",
    message: "Lorem Ipsum is simply dummy text...",
    notifications: 3,
    imgUrl:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  {
    name: "Paartha Jain",
    message: "Lorem Ipsum is simply dummy text...",
    notifications: 3,
    imgUrl:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  {
    name: "Paartha Jain",
    message: "Lorem Ipsum is simply dummy text...",
    notifications: 0,
    imgUrl:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  {
    name: "Paartha Jain",
    message: "Lorem Ipsum is simply dummy text...",
    notifications: 1,
    imgUrl:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  {
    name: "Paartha Jain",
    message: "Lorem Ipsum is simply dummy text...",
    notifications: 2,
    imgUrl:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
];

const initialDummyChats = [
  { message: "Hi there!", sender: "other", timestamp: new Date() },
  {
    message: "Hello! How can I help you today?",
    sender: "self",
    timestamp: new Date(),
  },
];

function Page() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState(initialDummyChats);

  const selectChat = (chat) => {
    setSelectedChat(chat);
  };
  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover bg-no-repeat min-h-screen pb-10">
      <ProctedNav />
      <div className="flex justify-between  mx-28">
        <div>
          <p className="text-xl font-semibold text-white mt-10">Messages</p>
          <input
            type="text"
            placeholder="Search Messages..."
            className="bg-white w-96 mt-5 outline-none px-4 py-2 rounded-md"
          />
          <div className="chat-container">
            <div className="flex flex-col  mt-5 mx-2  items-center">
              {dummyData.map((data, index) => (
                <div className="rounded-lg border mt-3 border-white">
                  <div
                    key={index}
                    onClick={() => selectChat(data)}
                    className="message-container w-full flex items-center text-white  bg-white bg-opacity-10 pr-10 rounded-lg py-3"
                  >
                    <div className="relative">
                      <img
                        src={data.imgUrl}
                        className="w-12 h-12 rounded-full"
                        alt=""
                      />
                      {data.notifications > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#3498DB] text-white rounded-full px-2 text-xs">
                          {data.notifications}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      <p className="text-lg text-[#3498DB]">{data.name}</p>
                      <p>{data.message}</p>
                    </div>
                    <div className="schedule">
                      <div className="bg-[#3498DB] flex flex-col px-2 rounded-b-lg items-center text-black">
                        <FaAngleUp className="rotate-180" />
                        <p className="text-sm">Schedule</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border w-[800px] mt-10 rounded-lg h-[540px] border-white flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            {selectedChat ? (
              <>
                <div className="flex justify-between px-3 items-center mb-2 text-white">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedChat.imgUrl}
                      className="w-12 h-12 rounded-full"
                      alt=""
                    />
                    <p className="text-lg">{selectedChat.name}</p>
                  </div>
                  <div>
                    <button className="border px-3 py-2 border-[#3498DB] rounded-lg">
                      HuddleO1
                    </button>
                  </div>
                </div>
                <hr />
                <div className="chat-messages  flex flex-col-reverse overflow-y-auto">
                  {chats.map((chat, index) => (
                    <div
                      key={index}
                      className={`message ${
                        chat.sender === "self" ? "self-message" : ""
                      }`}
                    >
                      {chat.message}
                      <div className="chat-time">
                        {format(chat.timestamp, "PPPp")}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-white">Select a chat to view messages</p>
            )}
          </div>
          {selectedChat && (
            <div className="mt-auto pb-2 px-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 rounded-md bg-transparent outline-none border border-white text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
