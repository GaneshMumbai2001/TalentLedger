import ProctedNav from "@/app/Components/ProctedNav";
import React from "react";

const tasks = [
  {
    id: 1,
    description:
      "Create the landing page including the home, about us and the contact us page. Should be clean and minimalistic.",
    status: "Notify as done",
  },
  {
    id: 2,
    description:
      "Create the landing page including the home, about us and the contact us page. Should be clean and minimalistic.",
    status: "Pending",
  },
  {
    id: 3,
    description:
      "Create the landing page including the home, about us and the contact us page. Should be clean and minimalistic.",
    status: "Paid",
  },
];

function page() {
  return (
    <div>
      <div className="bg-black bg-[url('../assets/linebar.png')] bg-cover bg-no-repeat min-h-screen pb-10">
        <ProctedNav />
        <div>
          <p className="text-4xl text-center text-white font-bold mt-12">
            Task Assigned
          </p>
          <div className="flex flex-col justify-center mt-10">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="choosecard border px-4 my-2 py-2 mx-auto md:w-[800px] rounded-lg text-center border-gray-200 bg-white"
              >
                <div className="flex items-center space-x-4   md:space-x-4 justify-center mt-2">
                  <p className="md:text-xl text-white  font-bold">{task.id}.</p>
                  <p className="md:text-xl text-white md:w-[560px] font-bold">
                    {task.description}
                  </p>
                  <button className="text-center px-3 font-semibold rounded-lg py-1 text-white bg-[#3498DB]">
                    {task.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
