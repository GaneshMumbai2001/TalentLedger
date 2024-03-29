"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Select from "react-select";
import countryList from "react-select-country-list";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [summary, setSummary] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [skills, setSkills] = useState("");
  const handleSubmit = () => {
    console.log({
      firstName,
      lastName,
      emailId,
      dateOfBirth,
      mobileNumber,
      summary,
      skills,
      portfolios,
      links,
      workExperiences,
      educationinfo,
    });
  };

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };
  const [suggestedSkills, setSuggestedSkills] = useState([
    "HTML",
    "CSS",
    "Adobe Photoshop",
    "Java",
    "Angular",
  ]);

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(skills ? `${skills}, ${skill}` : skill);
    }
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  const [portfolios, setPortfolios] = useState([{ title: "", url: "" }]);

  const handlePortfolioChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newPortfolios = [...portfolios];
    newPortfolios[index][field] = value;
    setPortfolios(newPortfolios);
  };

  const addPortfolio = () => {
    setPortfolios([...portfolios, { title: "", url: "" }]);
  };

  const removePortfolio = (index: number) => {
    const newPortfolios = [...portfolios];
    newPortfolios.splice(index, 1);
    setPortfolios(newPortfolios);
  };
  const [links, setLinks] = useState([{ title: "", url: "" }]);

  const handlelinksChange = (index: number, field: string, value: string) => {
    const newlinks = [...links];
    newlinks[index][field] = value;
    setLinks(newlinks);
  };

  const addlinks = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const removeLinks = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };
  const [workExperiences, setWorkExperiences] = useState([]);
  const handleWorkExperienceChange = (index, field, value) => {
    const updatedWorkExperiences = workExperiences.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setWorkExperiences(updatedWorkExperiences);
  };

  const [educationinfo, setEducationinfo] = useState([]);
  const handleEducationalChange = (index, field, value) => {
    const updatedEducation = educationinfo.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEducationinfo(updatedEducation);
  };
  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1980 + 1 },
    (v, k) => ({
      value: String(1980 + k),
      label: String(1980 + k),
    })
  );

  const addWorkExperience = () => {
    const newWorkExperience = {
      title: "",
      company: "",
      location: "",
      startMonth: "",
      startYear: "",
      country: "",
      endMonth: "",
      endYear: "",
      currentRole: false,
      description: "",
    };
    setWorkExperiences([...workExperiences, newWorkExperience]);
  };

  const removeWorkExperience = (index) => {
    const filteredWorkExperiences = workExperiences.filter(
      (_, idx) => idx !== index
    );
    setWorkExperiences(filteredWorkExperiences);
  };
  const addEducationinfo = () => {
    const newEducationalinfo = {
      school: "",
      degree: "",
      fieldofstudy: "",
      startMonth: "",
      startYear: "",
      description: "",
    };
    setEducationinfo([...educationinfo, newEducationalinfo]);
  };

  const removeEducationinfo = (index) => {
    const filteredEducationinfo = educationinfo.filter(
      (_, idx) => idx !== index
    );
    setEducationinfo(filteredEducationinfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#F3F3FF] overflow-y-scroll  h-[90%] p-5 rounded-3xl">
        <button
          onClick={onClose}
          className="float-right text-white bg-black rounded-full px-3 py-1 font-bold"
        >
          X
        </button>
        <div className="flex justify-between items-center px-10">
          <p className="text-2xl font-bold">Edit your profile</p>
        </div>
        <p className="mt-3 font-medium px-10">
          A professional photo helps you build trust with your clients. To keep
          things safe and simple, they’ll pay you through us - which
          <br /> is why we need your personal information.
        </p>
        <div className="px-10 flex mt-5 space-x-10">
          <div className="flex flex-col bg-white h-60 px-5 py-5 rounded-lg items-center">
            <div
              className={
                profileImage ? "rounded-full" : "bg-[#ECEFF4] p-5 rounded-full"
              }
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-32 w-32 rounded-full"
                />
              ) : (
                <FaUser size="5em" />
              )}
            </div>
            <label className="flex space-x-2 items-center text-[#00CBA0] border border-[#00CBA0] px-5 py-2 mt-3 rounded-lg cursor-pointer">
              <FaPlus />
              <span>Upload Photo</span>
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex  flex-col">
            <div className="bg-white rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Contact Info</p>
              <div className="flex space-x-5">
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    First Name*
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Last Name*
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Email ID*
                  </label>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                  />
                </div>
              </div>
              <div className="flex space-x-5">
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Mobile Number
                  </label>
                  <input
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Summary
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="border mt-3 h-20 border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white mt-5 rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Skills</p>
              <div className="">
                <div className="flex flex-col mt-5">
                  <label className="text-sm font-medium text-[#747474]">
                    Your Skills
                  </label>
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="border my-3 border-[#DCDCDC]  px-2 py-2 outline-none rounded-lg"
                    placeholder="Enter skills here"
                  />
                  <div className="text-sm text-[#747474] flex justify-end ">
                    <p>Max 15 Skils</p>
                  </div>
                </div>
                <div className="flex flex-col mt-5">
                  {suggestedSkills.length > 0 && (
                    <label className="text-sm font-medium text-[#747474]">
                      Suggested Skills
                    </label>
                  )}
                  <div className="text-sm mt-3 flex space-x-4">
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
              </div>
            </div>
            <div className="bg-white mt-5 rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Portfolio</p>
              {portfolios.map((portfolio, index) => (
                <div key={index} className="flex items-center space-x-5 mt-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Title
                    </label>
                    <input
                      value={portfolio.title}
                      onChange={(e) =>
                        handlePortfolioChange(index, "title", e.target.value)
                      }
                      className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Url
                    </label>
                    <input
                      value={portfolio.url}
                      onChange={(e) =>
                        handlePortfolioChange(index, "url", e.target.value)
                      }
                      className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => removePortfolio(index)}
                    className="bg-[#E95452] p-2 rounded-full text-white"
                  >
                    <MdDelete size="1em" />
                  </button>
                </div>
              ))}
              <button
                onClick={addPortfolio}
                className="text-[#00CBA0] flex space-x-2 items-center border border-[#00CBA0] px-5 py-2 rounded-lg mt-5 cursor-pointer"
              >
                <FaPlus />
                <span>Add Portfolio</span>
              </button>
            </div>
            <div className="bg-white mt-5 rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Social media Links</p>
              {links.map((links, index) => (
                <div key={index} className="flex items-center space-x-5 mt-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Title
                    </label>
                    <input
                      value={links.title}
                      onChange={(e) =>
                        handlelinksChange(index, "title", e.target.value)
                      }
                      className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Url
                    </label>
                    <input
                      value={links.url}
                      onChange={(e) =>
                        handlelinksChange(index, "url", e.target.value)
                      }
                      className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => removeLinks(index)}
                    className="bg-[#E95452] p-2 rounded-full text-white"
                  >
                    <MdDelete size="1em" />
                  </button>
                </div>
              ))}
              <button
                onClick={addlinks}
                className="text-[#00CBA0] flex space-x-2 items-center border border-[#00CBA0] px-5 py-2 rounded-lg mt-5 cursor-pointer"
              >
                <FaPlus />
                <span>Add Social Media</span>
              </button>
            </div>
            <div className="bg-white mt-5 rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Work Experience</p>
              {workExperiences.map((workExperience, index) => (
                <div key={index} className="space-y-4 mt-5">
                  <div className="flex items-center space-x-5">
                    <div className="flex-1 flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Title
                      </label>
                      <input
                        value={workExperience.title}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Company
                      </label>
                      <input
                        value={workExperience.company}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="flex-1 flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Location
                      </label>
                      <input
                        value={workExperience.location}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "location",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Country
                      </label>
                      <Select
                        options={countryOptions}
                        className="w-60"
                        onChange={(selectedOption) =>
                          handleWorkExperienceChange(
                            index,
                            "country",
                            selectedOption
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Start Date
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={workExperience.startMonth}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "startMonth",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] w-40 px-2 py-2 outline-none rounded-lg"
                        >
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={workExperience.startYear}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "startYear",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] px-2 py-2 outline-none rounded-lg"
                        >
                          {yearOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        End Date
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={workExperience.endMonth}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "endMonth",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] w-40 px-2 py-2 outline-none rounded-lg"
                          disabled={workExperience.currentRole}
                        >
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={workExperience.endYear}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "endYear",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] px-2 py-2 outline-none rounded-lg"
                          disabled={workExperience.currentRole}
                        >
                          {yearOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={workExperience.currentRole}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "currentRole",
                            e.target.checked
                          )
                        }
                      />
                      <label className="text-sm font-medium ml-2">
                        Currently working here
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Description
                    </label>
                    <textarea
                      value={workExperience.description}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="border mt-3 h-20 border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-[#E95452] border border-[#E95452] px-3 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-5">
                <button
                  onClick={addWorkExperience}
                  className="text-[#00CBA0] flex space-x-2 items-center border border-[#00CBA0] px-5 py-2 rounded-lg cursor-pointer"
                >
                  <FaPlus />
                  <span>Add Work Experience</span>
                </button>
              </div>
            </div>
            <div className="bg-white mt-5 rounded-lg px-10 py-5">
              <p className="text-2xl font-bold">Education History</p>
              {educationinfo.map((educationDetails, index) => (
                <div key={index} className="space-y-4 mt-5">
                  <div className="flex items-center space-x-5">
                    <div className="flex-1 flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        School
                      </label>
                      <input
                        value={educationDetails.school}
                        onChange={(e) =>
                          handleEducationalChange(
                            index,
                            "school",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Degree
                      </label>
                      <input
                        value={educationDetails.degree}
                        onChange={(e) =>
                          handleEducationalChange(
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-60 px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="flex-1 flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Field of Study
                      </label>
                      <input
                        value={educationDetails.fieldofstudy}
                        onChange={(e) =>
                          handleEducationalChange(
                            index,
                            "fieldofstudy",
                            e.target.value
                          )
                        }
                        className="border border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="flex-1 flex-col">
                      <label className="text-sm font-medium text-[#747474]">
                        Dates Attended{" "}
                      </label>
                      <div className="flex w-full space-x-2">
                        <select
                          value={educationDetails.startMonth}
                          onChange={(e) =>
                            handleEducationalChange(
                              index,
                              "startMonth",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] w-[50%] px-2 py-2 outline-none rounded-lg"
                        >
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={educationDetails.startYear}
                          onChange={(e) =>
                            handleEducationalChange(
                              index,
                              "startYear",
                              e.target.value
                            )
                          }
                          className="border border-[#DCDCDC] w-[50%] px-2 py-2 outline-none rounded-lg"
                        >
                          {yearOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#747474]">
                      Description
                    </label>
                    <textarea
                      value={educationDetails.description}
                      placeholder="Describe your studies, awards, etc..."
                      onChange={(e) =>
                        handleEducationalChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="border mt-3 h-20 border-[#DCDCDC] w-full px-2 py-2 outline-none rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => removeEducationinfo(index)}
                    className="text-[#E95452] border border-[#E95452] px-3 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-5">
                <button
                  onClick={addEducationinfo}
                  className="text-[#00CBA0] flex space-x-2 items-center border border-[#00CBA0] px-5 py-2 rounded-lg cursor-pointer"
                >
                  <FaPlus />
                  <span>Add Educational History</span>
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="mt-5 bg-[#00CBA0] font-semibold text-md px-5 py-2 rounded-lg"
              >
                Review your profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
