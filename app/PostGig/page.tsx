"use client";
import React, { useState } from "react";
import ProctedNav from "../Components/ProctedNav";

import { useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OpenAI } from "langchain/llms/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Particle from "../Components/Particles";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  CheckTokenBalance,
  TransferToEscow,
} from "@/config/BlockchainServices";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";

interface TasksAndPayments {
  tasks: { [key: string]: string };
  paymentSplit: { [key: string]: string };
}

function Page() {
  const [role, setRole] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [gigId, setGigid] = useState("");
  const [aiGeneratedTask, setAiGeneratedTask] = useState("");
  const [editableTaskPoints, setEditableTaskPoints] = useState([]);
  const [editablePaymentSplit, setEditablePaymentSplit] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const [tasks, setTasks] = useState<string[]>([]);
  const [payments, setPayments] = useState<string[]>([]);
  const [did, setDid] = useState("");
  const [persona, setPersona] = useState<string>();
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setAddress(await signer.getAddress());
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (address) {
      getUser(address);
    }
  }, [address]);
  const [balance, setBalance] = useState("");
  const getUser = async (address) => {
    try {
      const postData = {
        address: address,
      };
      const balance = await CheckTokenBalance({ address: address });
      if (balance) {
        const balanceInNo = ethers.utils.formatEther(balance._hex);
        setBalance(balanceInNo);
      }
      const response = await fetch("https://gigshub-v1.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseData = await response.json();
      setDid(ethers.utils.toUtf8String(responseData.did));
      const personatype = responseData.persona;
      setPersona(personatype);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const [tasksAndPayments, setTasksAndPayments] =
    useState<TasksAndPayments | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      }
    }
    initialize();
  });
  const allFieldsFilled = role && timeline && description && pay;

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAWPTkvm5tFvKgv2S_w-Sw2MJPV-_Qakg8"
  );
  async function generateTasksAndPayments(role, description, timeline, pay) {
    setIsLoading(true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Based on the following gig details, generate a detailed broken down task description payment split.
      Role: ${role}
      Description: ${description}
      Timeline (in months): ${timeline}
      Total Pay: ${pay} in Gig tokens

      provide it in the following format of json
      {
        "tasks" :{
          "task1": "task1 description",
          "task2": "task2 description",
        },
        "paymentSplit": {
"task1payment": " amount",,
"task2payment": " amount",
        }
        
      }

      i only need to get this json as a response without any other text
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedata = text.replace(/```json|```/g, "");
    const jsonMatch = parsedata.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      const jsonObject = JSON.parse(jsonString);
      setTasksAndPayments(jsonObject);
      const taskValues = Object.values(jsonObject.tasks);
      const paymentValues = Object.values(jsonObject.paymentSplit);
      setTasks(taskValues);
      setPayments(paymentValues);
    }
    const taskSections = text.split(/\*\*Month \d+\*\*/);
    const paymentSection = text
      .match(/\*\*Payment Split\*\*:(.+)/s)?.[1]
      .trim();

    const tasksProcessed = taskSections
      .map((section, index) => {
        if (index === 0 || !section) return null;
        const tasks = section
          .split("\n")
          .filter((line) => line.trim().startsWith("*"))
          .map((line) => line.replace("*", "").trim())
          .join(", ");
        const paymentRegex = new RegExp(`Month ${index}: \\$([0-9]+)`);
        const paymentMatch = paymentSection.match(paymentRegex);
        const payableAmount = paymentMatch ? paymentMatch[1] : "N/A";

        return {
          month: index,
          task: tasks,
          payableAmount: payableAmount,
        };
      })
      .filter(Boolean);
    setAiGeneratedTask(text);
    setEditableTaskPoints(tasksProcessed);
    setEditablePaymentSplit(
      tasksProcessed.map((task) => ({
        month: task.month,
        amount: task.payableAmount,
      }))
    );
    setIsLoading(false);
    setCurrentStep(2);
  }
  const handleTaskPointEdit = (index, event) => {
    const newTaskPoints = [...editableTaskPoints];
    newTaskPoints[index].task = event.target.value;
    setEditableTaskPoints(newTaskPoints);
  };

  const handlePaymentSplitEdit = (index, event) => {
    const newSplits = [...editablePaymentSplit];
    newSplits[index].amount = event.target.value;
    setEditablePaymentSplit(newSplits);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    generateTasksAndPayments(role, description, timeline, pay);
    toast.success("Task generation initiated ");
  };
  const handleBack = () => {
    setCurrentStep(1);
  };

  const postData = async () => {
    console.log("pay ammount before calling the escrow", pay);
    try {
      const response = await axios.post(
        "https://gigshub-v1.vercel.app/api/post-gig",
        {
          title: role,
          timeline: timeline,
          description: description,
          budget: pay,
          tasks: tasks,
          payments: payments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalSubmit = async () => {
    toast.success("Submitting the final data ");

    try {
      console.log("pay ammount before calling the escrow contract", pay);
      const res = await TransferToEscow({ val: pay });
      const response = await postData();
      console.log("response", response);
      if (response.status === 201) {
        toast.success("Gig created Successfully!");
        router.push("/PostedGigs");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover  bg-no-repeat min-h-screen">
      <Navbar did={did} persona={persona} balance={balance} />
      {currentStep === 1 && (
        <>
          <div className="pt-5 md:pt-12 md:pl-20">
            <p className="text-center text-white font-bold text-5xl">
              Enter Your Details
            </p>
          </div>
          <div className="flex flex-col pt-8 items-center justify-center">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:my-5 md:gap-16">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                type="text"
                placeholder="Gig*"
                required
                className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
              />
              <input
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                type="text"
                placeholder="Enter the timeline (in Months)*"
                required
                className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
              />
            </div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row my-4 md:my-5 md:gap-16">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description*"
                required
                className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
              />
              <input
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                type="text"
                placeholder="How much would you pay*"
                required
                className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
              />
            </div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row my-4 md:my-5 md:gap-16">
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                type="text"
                placeholder="Skills Required*"
                required
                className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
              />
            </div>
            <button
              disabled={!allFieldsFilled}
              className={`text-lg md:mt-5 px-3 py-2 rounded-xl ${
                allFieldsFilled
                  ? "bg-[#3498DB] text-white"
                  : "bg-white text-[#666]"
              }`}
              onClick={handleSubmit}
            >
              {" "}
              {isLoading ? <div>Generating...</div> : <p>Continue</p>}
            </button>
          </div>
        </>
      )}
      {currentStep === 2 && (
        <div className="text-center md:mx-auto mx-4 w-[600px] text-white mt-4">
          <h2 className="text-4xl mb-3 font-bold mt-5">Set the Stage</h2>
          <h2>Define Tasks and Rewards</h2>
          {tasks &&
            payments &&
            tasks.map((task, index) => (
              <div
                key={`task-${index}`}
                className="flex mt-6 justify-center space-x-4 items-center mb-6 "
              >
                <div className="">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskPointEdit(task, e)}
                    className="border bg-transparent px-3 py-2  rounded-xl w-[500px] text-white"
                  />
                </div>
                {payments.length > index && (
                  <div className="">
                    <input
                      type="text"
                      value={payments[index]}
                      onChange={(e) =>
                        handlePaymentSplitEdit(payments[index], e)
                      }
                      className="border bg-transparent px-3 py-2 rounded-xl w-[100px] text-white"
                    />
                  </div>
                )}
              </div>
            ))}
          <button
            onClick={handleBack}
            className="text-lg px-3 py-2 rounded-xl bg-[#3498DB] text-white mr-2"
          >
            Back
          </button>
          <button
            onClick={handleFinalSubmit}
            className="text-lg px-3 py-2 rounded-xl bg-[#3498DB] text-white"
          >
            Submit
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Page;
