import React, { useState } from "react";

function EditSkills({ skills: initialSkills, closeForm, updateSkills }) {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");

  const handleSkillInputChange = (e) => {
    setNewSkill(e.target.value);
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSkills(skills);
    closeForm();
  };

  return (
    <div className="modal">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:pt-2 space-y-3 items-center justify-center"
      >
        <div className="flex items-center">
          <input
            value={newSkill}
            onChange={handleSkillInputChange}
            className="md:w-[200px] outline-none bg-transparent rounded-lg px-3 py-2 border border-gray-200"
            type="text"
          />
          <button
            className="bg-green-400 px-4 py-2 ml-2 rounded-lg"
            type="button"
            onClick={addSkill}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex skillint text-white px-3 py-1 rounded-full"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-gray-100 ml-2"
              >
                &#x2715; {/* HTML entity for the multiplication sign (x) */}
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded-lg text-white"
          >
            Save Skills
          </button>
          <button
            onClick={closeForm}
            className="bg-red-400 px-4 py-2 rounded-lg text-white ml-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSkills;
