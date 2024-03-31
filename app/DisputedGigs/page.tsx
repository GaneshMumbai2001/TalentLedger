import React, { useState } from "react";
import ProtectedNavbar from "../Components/ProctedNavbar";
import { FaEye, FaSortDown, FaSortUp } from "react-icons/fa";

function page() {
  const disputedgigs = [
    {
      gigs: "Ganesh",
      reason: "Exceeding rules against Contract",
      votes: "20",
      status: "Cancelled",
    },
  ];

  return (
    <div>
      <ProtectedNavbar />
      <div className="pt-20 pl-20 text-3xl font-semibold">
        <p>Disputed Gigs</p>
      </div>
      <div className="my-3 border-2 mx-20 mt-5 border-[#F7F7F7] rounded-lg">
        <table className="w-full  text-left  rounded-lg overflow-hidden">
          <thead className="text-[#747474] h-12 mt-5 bg-[#F7F7F7]">
            <tr className="uppercase">
              <th className="pl-5">Gigs</th>
              <th className="pl-5">Reason for vote</th>
              <th className="pl-5">Total Votes</th>
              <th className="pl-5">Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {disputedgigs.map((gig, index) => (
              <tr key={index} className="border-b-[#F1F1F1] border">
                <td className="p-2">
                  <div className="flex items-center justify-left pl-5 h-full">
                    {gig.gigs}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-left pl-3 h-full">
                    {gig.reason}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-left pl-3 h-full">
                    {gig.votes}
                  </div>
                </td>

                <td className="p-2 flex justify-left ">
                  <div
                    className={`flex items-center justify-center h-full px-3 w-40 py-2 rounded-full ${
                      gig.status === "Upcoming"
                        ? "bg-[#E6F3F0] text-[#309972]"
                        : gig.status === "Ongoing"
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
  );
}

export default page;
