import { useState } from "react";

export default function EditAchievementForm({ achievement, onSave, onClose }) {
  const [editedAchievement, setEditedAchievement] = useState(achievement);

  const handleSubmit = () => {
    onSave(editedAchievement);
    onClose();
  };
  return (
    <div className="modal">
      <div className="flex justify-center mb-5">
        <input
          value={editedAchievement}
          className="md:w-[300px] outline-none bg-transparent rounded-lg px-3 py-2 border border-gray-200"
          onChange={(e) => setEditedAchievement(e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-2 space-x-4">
        <button
          className="bg-blue-500 px-4 py-2 rounded-lg text-white"
          onClick={handleSubmit}
        >
          Update
        </button>
        <button
          className="bg-red-400 px-4 py-2 rounded-lg text-white ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
