"use client";
import React, { useState } from "react";
import ProctedNav from "../Components/ProctedNav";
import Particle from "../Components/Particles";

function Page() {
  const [name, setName] = useState("");
  const [expectations, setExpectations] = useState("");
  const [stack, setStack] = useState("");
  const [location, setLocation] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [email, setEmail] = useState("");
  const allFieldsFilled =
    name && expectations && stack && location && telegramId && email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      expectations,
      stack,
      location,
      telegramId,
      email,
    };
    try {
      console.log(formData);
    } catch (error) {}
  };

  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen">
      <ProctedNav />
      <div className=" pt-5 md:pt-12  md:pl-20">
        <p className="text-center text-white font-bold text-3xl md:text-5xl">
          Enter Your Details
        </p>
        <p className="text-center my-2 text-[#000] font-bold text-md">
          Select Your Role in the GigsHub
        </p>
      </div>
      <div className="flex flex-col  items-center justify-center">
        <div className="flex flex-col md:space-y-0 space-y-4 my-4 md:flex-row md:my-5 md:gap-16">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What’s your Name*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
          <input
            type="text"
            value={expectations}
            onChange={(e) => setExpectations(e.target.value)}
            placeholder="What’s your Expectations*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
        </div>
        <div className="flex flex-col md:space-y-0 space-y-4 md:flex-row  md:my-5 md:gap-16">
          <input
            type="text"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            placeholder="Stack*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
        </div>
        <div className="flex flex-col md:space-y-0 space-y-4 md:flex-row my-4 md:my-5 md:gap-16">
          <input
            type="text"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Enter your Telegram ID*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email ID*"
            required
            className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          />
        </div>
        <button
          disabled={!allFieldsFilled}
          className={`text-lg md:mt-5 px-3 py-2 rounded-xl ${
            allFieldsFilled ? "bg-[#3498DB] text-white" : "bg-white text-[#666]"
          }`}
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Page;
