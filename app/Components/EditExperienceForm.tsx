import React, { useState } from "react";

function EditExperienceForm({ experience, closeForm, updateExperience }) {
  const [designation, setDesignation] = useState(experience?.designation || "");
  const [organisation, setOrganisation] = useState(
    experience?.organisation || ""
  );
  const [location, setLocation] = useState(experience?.location || "");
  const [description, setDescription] = useState(experience?.description || "");
  const [startDate, setStartDate] = useState(experience?.startDate || "");
  const [endDate, setEndDate] = useState(experience?.endDate || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExperience = {
      designation,
      organisation,
      location,
      description,
      startDate,
      endDate,
    };
    updateExperience(updatedExperience);
    closeForm();
  };

  return (
    <div className="modal">
      <form
        onSubmit={handleSubmit}
        className="flex  flex-col md:pt-2 space-y-3  items-center justify-center"
      >
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="Designation"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          placeholder="Organisation"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="date"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Month"
        />
        <input
          type="date"
          className="border bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Month"
        />
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
      </form>
    </div>
  );
}

export default EditExperienceForm;
