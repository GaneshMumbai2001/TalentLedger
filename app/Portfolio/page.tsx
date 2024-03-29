"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import { FaEye, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";

const initialGigs = [
  {
    provider: "Company Name",
    gig: "Website Developer",
    dueOn: "13/05/2022",
    total: "$1,000",
    status: "Posted gigs",
  },
  {
    provider: "Design Co",
    gig: "Graphic Design",
    dueOn: "15/06/2022",
    total: "$600",
    status: "Posted gigs",
  },
  {
    provider: "Tech Solutions",
    gig: "Software Development",
    dueOn: "20/07/2022",
    total: "$2,000",
    status: "Cancelled",
  },
  {
    provider: "Creative Minds",
    gig: "Content Writing",
    dueOn: "25/08/2022",
    total: "$500",
    status: "Completed",
  },
  {
    provider: "Innovate LLC",
    gig: "Mobile App Development",
    dueOn: "05/09/2022",
    total: "$3,000",
    status: "Posted gigs",
  },
  {
    provider: "Art & Design Studio",
    gig: "UI/UX Design",
    dueOn: "17/10/2022",
    total: "$1,200",
    status: "Ongoing gigs",
  },
  {
    provider: "Data Analytics Inc.",
    gig: "Data Analysis Project",
    dueOn: "29/11/2022",
    total: "$2,500",
    status: "Cancelled",
  },
  {
    provider: "Web Solutions",
    gig: "E-commerce Website",
    dueOn: "12/12/2022",
    total: "$4,500",
    status: "Completed",
  },
  {
    provider: "NextGen Developers",
    gig: "Blockchain Development",
    dueOn: "22/01/2023",
    total: "$5,000",
    status: "Ongoing gigs",
  },
  {
    provider: "Creative Marketing",
    gig: "Digital Marketing Campaign",
    dueOn: "03/02/2023",
    total: "$800",
    status: "Ongoing gigs",
  },
  {
    provider: "Cloud Services",
    gig: "Cloud Migration Project",
    dueOn: "14/03/2023",
    total: "$3,200",
    status: "Cancelled",
  },
  {
    provider: "SEO Specialists",
    gig: "SEO Optimization Project",
    dueOn: "25/04/2023",
    total: "$1,000",
    status: "Completed",
  },
  {
    provider: "Virtual Events Org",
    gig: "Virtual Conference Setup",
    dueOn: "05/05/2023",
    total: "$2,200",
    status: "Posted gigs",
  },
  {
    provider: "Cybersecurity Experts",
    gig: "Cybersecurity Audit",
    dueOn: "16/06/2023",
    total: "$3,500",
    status: "Ongoing gigs",
  },
  {
    provider: "Networking Solutions",
    gig: "Network Infrastructure Upgrade",
    dueOn: "27/07/2023",
    total: "$4,000",
    status: "Cancelled",
  },
  {
    provider: "Enterprise Software",
    gig: "CRM System Customization",
    dueOn: "07/08/2023",
    total: "$6,000",
    status: "Completed",
  },
];

function page() {
  const [selectedCategory, setSelectedCategory] = useState("Posted gigs");
  const [gigs, setGigs] = useState(initialGigs);
  const categories = ["Posted gigs", "Ongoing gigs", "Cancelled", "Completed"];
  const totalGigs = initialGigs.length;
  const cancelledGigs = initialGigs.filter(
    (gig) => gig.status === "Cancelled"
  ).length;
  const completedGigs = initialGigs.filter(
    (gig) => gig.status === "Completed"
  ).length;

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [underlineStyle, setUnderlineStyle] = useState({});
  const categoryRefs = useRef([]);

  useEffect(() => {
    const currentCategoryRef =
      categoryRefs.current[categories.indexOf(selectedCategory)];
    if (currentCategoryRef) {
      setUnderlineStyle({
        width: `${currentCategoryRef.offsetWidth}px`,
        left: `${currentCategoryRef.offsetLeft}px`,
        top: `${
          currentCategoryRef.offsetTop + currentCategoryRef.offsetHeight
        }px`,
      });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredGigs = useMemo(() => {
    let sortableGigs = [
      ...gigs.filter((gig) => gig.status === selectedCategory),
    ];
    if (sortConfig.key !== null) {
      sortableGigs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGigs;
  }, [gigs, selectedCategory, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else {
      direction = "ascending";
    }

    setSortConfig({ key, direction });

    setGigs((gigs) => {
      const newGigs = [...gigs];
      if (key === "dueOn") {
        newGigs.sort((a, b) => {
          const dateA = new Date(
            a[key].split("/").reverse().join("-")
          ).getTime();
          const dateB = new Date(
            b[key].split("/").reverse().join("-")
          ).getTime();

          if (dateA < dateB) {
            return direction === "ascending" ? -1 : 1;
          }
          if (dateA > dateB) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      } else {
        newGigs.sort((a, b) => {
          if (a[key] < b[key]) {
            return direction === "ascending" ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      return newGigs;
    });
  };

  return (
    <div className="pb-10">
      <ProtectedNavbar />
      <div className="px-20 mt-8">
        <p className="text-2xl font-bold">My Portfolio</p>
        <div className="mt-8 flex space-x-6">
          <div className="bg-[#FBF4EE] w-56 p-6 rounded-lg">
            <p className="text-2xl font-bold">{totalGigs}</p>
            <p className="text-[#747474]">Posted Gigs</p>
          </div>
          <div className="bg-[#FBF4EE] w-56 p-6 rounded-lg">
            <p className="text-2xl font-bold">{completedGigs}</p>
            <p className="text-[#747474]">Completed</p>
          </div>
          <div className="bg-[#FBF4EE] w-56 p-6 rounded-lg">
            <p className="text-2xl font-bold">{cancelledGigs}</p>
            <p className="text-[#747474]">Withdraw</p>
          </div>
        </div>
        <div>
          <p className="text-2xl my-8 font-bold">Manage Gigs</p>
          <div className="relative flex items-center gap-4 mb-5 text-[#747474] text-sm">
            {categories.map((category, index) => (
              <p
                key={category}
                ref={(el) => (categoryRefs.current[index] = el)}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer ${
                  selectedCategory === category ? "text-[#00CBA0]" : ""
                }`}
              >
                {category}
              </p>
            ))}
            <div
              className="absolute bg-[#00CBA0] mt-5  h-0.5"
              style={underlineStyle}
            ></div>
          </div>
          <div className="border mb-5 border-t-[#DCDCDC]"></div>

          <div className="my-3 border-2  border-[#F7F7F7] rounded-lg">
            <table className="w-full  text-left  rounded-lg overflow-hidden">
              <thead className="text-[#747474] h-12 mt-5 bg-[#F7F7F7]">
                <tr className="uppercase">
                  {["provider", "gig", "dueOn", "total"].map((key) => (
                    <th
                      key={key}
                      onClick={() => requestSort(key)}
                      className="cursor-pointer "
                    >
                      <div className="flex  items-center justify-left pl-5 space-x-2">
                        <span>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        {sortConfig.key === key ? (
                          sortConfig.direction === "ascending" ? (
                            <FaSortUp className="text-[#BFBFBF]" />
                          ) : (
                            <FaSortDown className="text-[#BFBFBF]" />
                          )
                        ) : (
                          <FaSortUp className="text-[#BFBFBF]" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="pl-5">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGigs.map((gig, index) => (
                  <tr key={index} className="border-b-[#F1F1F1] border">
                    <td className="p-2">
                      <div className="flex items-center justify-left pl-5 h-full">
                        {gig.provider}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-left pl-3 h-full">
                        {gig.gig}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-left pl-3 h-full">
                        {gig.dueOn}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-left pl-3 h-full">
                        {gig.total}
                      </div>
                    </td>
                    <td className="p-2 flex justify-left ">
                      <div
                        className={`flex items-center justify-center h-full px-3 w-40 py-2 rounded-full ${
                          gig.status === "Posted gigs"
                            ? "bg-[#E6F3F0] text-[#309972]"
                            : gig.status === "Ongoing gigs"
                            ? "bg-[#FAF0DF] text-[#DE8C11]"
                            : gig.status === "Cancelled"
                            ? "bg-[#FFE5E4] text-[#973030]"
                            : "bg-[#E6F3F0] text-[#309972]"
                        }`}
                      >
                        {gig.status}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex  items-center justify-left pl-3 h-full">
                        <FaEye className="text-[#00CBA0] cursor-pointer h-6 w-auto" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
