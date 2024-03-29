import React, { useState } from "react";

function EditProjectForm({ academicProjects, closeForm, updateProject }) {
  const [title, setTitle] = useState(academicProjects.title || "");
  const [startMonth, setStartMonth] = useState(
    academicProjects.startMonth || ""
  );
  const [endMonth, setEndMonth] = useState(academicProjects.endMonth || "");
  const [description, setDescription] = useState(
    academicProjects.description || ""
  );
  const [projectLink, setProjectLink] = useState(
    academicProjects.projectLink || ""
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedInfo = {
      title,
      startMonth,
      endMonth,
      description,
      projectLink,
    };
    updateProject(updatedInfo);
    closeForm();
  };

  return (
    <div className="modal  ">
      <form onSubmit={handleSubmit}>
        <div className="flex  flex-col md:pt-2  items-center justify-center">
          <div className="flex flex-col space-y-4 md:space-y-0  md:my-2 md:gap-4">
            <div className="flex flex-col text-sm text-[#FFF] font-light space-y-1">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                required
                className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
              />
            </div>
            <div className="flex space-x-5">
              <div className="flex flex-col  text-sm text-[#FFF] font-light space-y-1">
                <label>Start Month</label>
                <input
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  type="month"
                  placeholder="Start Month"
                  required
                  className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-white text-white outline-none"
                />
              </div>
              <div className="flex flex-col text-sm text-[#FFF] font-light space-y-1">
                <label>End Month</label>
                <input
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  type="month"
                  placeholder="End Month"
                  className="border bg-transparent px-3 rounded-xl md:w-40 py-2 border-white text-white outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 md:space-y-0  md:my-2 md:gap-4">
            <div className="flex flex-col text-sm text-[#FFF] font-light space-y-1">
              <label>Description (Optional)</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
              />
            </div>
            <div className="flex flex-col text-sm text-[#FFF] font-light space-y-1">
              <label>Project Link (Optional)</label>
              <input
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                type="url"
                placeholder="Project Link"
                className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
              />
            </div>
          </div>

          <div className=" flex space-x-5 justify-center">
            <button
              type="submit"
              className="border my-5 choosecard text-sm px-6  rounded-xl mb-5 md:mb-2 py-3 border-white text-white"
            >
              <span className="flex justify-center space-x-2">Update</span>
            </button>
            <button
              className="border my-5 bg-red-400 text-sm px-6  rounded-xl mb-5 md:mb-2 py-3 border-white text-white"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProjectForm;
