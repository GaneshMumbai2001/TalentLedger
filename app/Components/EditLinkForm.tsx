import { useState } from "react";

export default function EditLinkForm({ link, onSave, onClose }) {
  const [editedLink, setEditedLink] = useState(link);

  const handleChange = (key, value) => {
    setEditedLink({ ...editedLink, [key]: value });
  };

  const handleSubmit = () => {
    onSave(editedLink);
    onClose();
  };

  return (
    <div className="modal">
      <div className="flex flex-col justify-between items-center space-y-2">
        {Object.keys(link).map((key) => (
          <input
            key={key}
            value={editedLink[key]}
            className="md:w-[300px] outline-none bg-transparent rounded-lg px-3 py-2 border border-gray-200"
            placeholder={`${key} Links`}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ))}
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
