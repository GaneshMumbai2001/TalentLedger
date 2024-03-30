"use client";
import React, { useState, useEffect } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import { useEthereum } from "../Components/DataContext";
import { AiOutlineArrowRight } from "react-icons/ai";
interface TasksAndPayments {
  tasks: { [key: string]: string };
  paymentSplit: { [key: string]: string };
}

function Page() {
  const [gig, setGig] = useState("");
  const [timeline, setTimeline] = useState("");
  const [pay, setPay] = useState("");
  const [skills, setSkills] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [payments, setPayments] = useState<string[]>([]);
  const [aiGeneratedTask, setAiGeneratedTask] = useState("");
  const [editableTaskPoints, setEditableTaskPoints] = useState([]);
  const [editablePaymentSplit, setEditablePaymentSplit] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [balance, setBalance] = useState(0);
  const router = useRouter();

  const [suggestedSkills, setSuggestedSkills] = useState([
    "HTML",
    "CSS",
    "Adobe Photoshop",
    "Angular",
  ]);
  const [tasksAndPayments, setTasksAndPayments] =
    useState<TasksAndPayments | null>(null);
  const initialSkills = ["HTML", "CSS", "Adobe Photoshop", "Angular"];
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAWPTkvm5tFvKgv2S_w-Sw2MJPV-_Qakg8"
  );

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(skills ? `${skills}, ${skill}` : skill);
    }
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  useEffect(() => {
    const currentSkills = skills.split(", ").filter(Boolean);
    const skillsToAddBack = initialSkills.filter(
      (skill) => !currentSkills.includes(skill)
    );

    setSuggestedSkills(skillsToAddBack);
  }, [skills]);

  async function generateTasksAndPayments(role, description, timeline, pay) {
    setIsLoading(true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Based on the following gig details, generate a detailed broken down task description payment split.
      Role: ${role}
      Description: ${description}
      Timeline (in months): ${timeline}
      Total Pay: ${pay} (it should be a number)

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
    console.log("res", response);
    const text = response.text();
    console.log("text", text);
    const parsedata = text.replace(/```json|```/g, "");
    console.log("parse data", parsedata);
    const jsonMatch = parsedata.match(/\{[\s\S]*\}/);
    console.log("json match", jsonMatch);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      console.log(jsonString);
      const jsonObject = JSON.parse(jsonString);
      console.log("jsonObj", jsonObject);
      setTasksAndPayments(jsonObject);
      const taskValues = Object.values(jsonObject.tasks);
      console.log("task values", taskValues);
      const paymentValues = Object.values(jsonObject.paymentSplit);
      console.log("payment", paymentValues);
      setTasks(taskValues);
      setPayments(paymentValues);
    }
    const taskSections = text.split(/\*\*Month \d+\*\*/);
    const paymentSection = text
      .match(/\*\*Payment Split\*\*:(.+)/s)?.[1]
      .trim();

    console.log(taskSections);
    console.log(paymentSection);

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
        console.log(tasksProcessed);

        console.log(paymentMatch);
        console.log(paymentRegex);
        console.log(payableAmount);

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

  const handleSubmit = async () => {
    console.log({ gig, timeline, pay, skills, summary });
    try {
      const response = await generateTasksAndPayments(
        gig,
        summary,
        timeline,
        pay
      );

      console.log(response);
    } catch (error) {
      console.log("erroe with llm ", error);
    }
    console.log({
      gig,
      timeline,
      pay,
      skills,
      summary,
      tasks,
      payments,
    });
  };

  const handleBack = () => {
    setCurrentStep(1);
  };
  const { address } = useEthereum();
  console.log("add", address);

  const handleSubmitGig = async () => {
    try {
      const skillarray = skills.split(", ");

      const id = 8;

      const res = await axios.post(
        "https://talentledger-be.vercel.app/api/post-gig",
        {
          title: gig,
          description: summary,
          budget: pay,
          address: address,
          timeline: timeline,
          tasks: tasks,
          payments: payments,
          skills: skillarray,
          escrowId: id,
        }
      );

      if (res.status === 201) {
        toast.success("posted successfully");
        router.push("/FreelancerDashboard");
      }
      if (res.status === 500) {
        toast.warn("Internal Server Error");
      }
    } catch (error) {
      console.log("submit gig error", error);
    }
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handlePaymentChange = (index, value) => {
    const newPayments = [...payments];
    newPayments[index] = Number(value);
    setPayments(newPayments);
  };
  const [ellipsis, setEllipsis] = useState("");
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setEllipsis("");
    }
  }, [isLoading]);
  return (
    <div>
      <ProtectedNavbar />
      <ToastContainer />

      {currentStep === 1 && (
        <div className="mt-8">
          <p className="text-3xl font-bold text-center">Post Gig</p>
          <div className="flex justify-center my-3">
            <div className="border border-[#DCDCDC] rounded-xl px-5 py-5">
              <div className="flex gap-2 flex-col">
                <div>
                  <label className="text-sm text-[#747474]">Enter Gigs*</label>
                  <input
                    value={gig}
                    onChange={(e) => setGig(e.target.value)}
                    className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#747474]">
                    Enter the timeline
                    <span className="text-black font-semibold ml-1 text-[12px]">
                      (in Months)
                    </span>
                  </label>
                  <input
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#747474]">
                    How much would you pay*
                  </label>
                  <input
                    value={pay}
                    onChange={(e) => setPay(e.target.value)}
                    className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#747474]">
                    Skills Required*
                  </label>
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                  />
                </div>
                <div>
                  {suggestedSkills.length > 0 && (
                    <label>Suggested Skills</label>
                  )}

                  <div className="text-sm flex space-x-4">
                    {suggestedSkills.map((skill, index) => (
                      <p
                        key={index}
                        onClick={() => handleAddSkill(skill)}
                        className="bg-[#DCDCDC] cursor-pointer flex space-x-2 px-3 py-1 rounded-full font-semibold items-center"
                      >
                        <FaPlus className="text-[#00CBA0]" />
                        <span> {skill} </span>
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#747474]">Summary</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full h-20 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <button
              onClick={handleSubmit}
              className="bg-[#009DB5] space-x-2 flex items-center px-6 py-2 rounded-lg"
            >
              {isLoading ? (
                <p>GigSync{ellipsis}</p>
              ) : (
                <>
                  <span className="flex">
                    Next <AiOutlineArrowRight className="mt-2 ml-1" />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {currentStep == 2 && (
        <div className="mt-8">
          <p className="text-3xl font-bold text-center">Post Gig</p>
          <div className="flex flex-col items-center justify-center my-3">
            <div className="border border-[#DCDCDC] rounded-xl px-5 py-5">
              <div className="flex flex-col flex-wrap gap-5">
                {tasks.map((task, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="flex gap-2 flex-col">
                      <div>
                        <label className="text-sm text-[#747474]">Tasks*</label>
                        <input
                          value={task}
                          onChange={(e) =>
                            handleTaskChange(index, e.target.value)
                          }
                          className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <div>
                        <label className="text-sm text-[#747474]">
                          Allocated Tokens*
                        </label>
                        <input
                          type="number"
                          value={payments[index] || ""}
                          onChange={(e) =>
                            handlePaymentChange(index, e.target.value)
                          }
                          className="w-full h-8 px-2 py-2 border border-[#DCDCDC] rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5 gap-5">
            <button
              onClick={handleBack}
              className="bg-gray-300 space-x-2 flex items-center px-6 py-2 rounded-lg"
            >
              <span>Back</span> <FaArrowLeft />
            </button>{" "}
            <button
              onClick={handleSubmitGig}
              className="bg-[#009DB5] space-x-2 flex items-center px-6 py-2 rounded-lg"
            >
              <span>Sumbit </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
