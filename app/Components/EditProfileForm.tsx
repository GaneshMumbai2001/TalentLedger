import { uploadFileToPinata } from "@/config/pintoIPFS";
import React, { useState } from "react";

function EditProfileForm({ personalInformation, closeForm, updateProfile }) {
  const [name, setName] = useState(personalInformation.name || "");
  const [lastName, setLastName] = useState(personalInformation.lastName || "");
  const [email, setEmail] = useState(personalInformation.email || "");
  const [bio, setBio] = useState(personalInformation.bio || "");
  const [profileImage, setProfileImage] = useState(
    personalInformation.profileImage || ""
  );
  const [designation, setDesignation] = useState(
    personalInformation.designation || ""
  );
  const [filehash, setFileHash] = useState(personalInformation.filehash || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const filehash = await uploadFileToPinata(file);
      setSelectedFile(filehash.IpfsHash);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedInfo = {
      name,
      lastName,
      email,
      bio,
      designation,
      profileImage,
      filehash: selectedFile,
    };
    updateProfile(updatedInfo);
    closeForm();
  };

  return (
    <div className="modal">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:pt-2 space-y-3 items-center justify-center"
      >
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          type="email"
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="Bio"
        />
        <input
          type="text"
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Designation"
        />
        <label>Profile Image</label>
        <input
          type="file"
          accept="image/*"
          placeholder="Profile Image"
          onChange={handleImageUpload}
          className="border bg-transparent px-3 rounded-xl md:w-96 py-2 border-white text-white outline-none"
        />
        <label>Resume</label>
        <input
          type="file"
          onChange={handleFileInput}
          id="file"
          style={{ display: "none" }}
        />
        <input
          type="file"
          onChange={handleFileInput}
          id="file"
          className="border text-center bg-transparent px-3 rounded-xl md:w-80 py-2 border-white text-white outline-none"
        />
        {selectedFile ? (
          <div>
            <p>Selected file: {selectedFile.slice(0, 5)}</p>
          </div>
        ) : (
          <div>
            <p>Resume Hash: {filehash.slice(0, 5)}</p>
          </div>
        )}
        <div className="flex space-x-5 justify-center">
          <button
            type="submit"
            disabled={isUploading}
            className="border my-5 choosecard text-sm px-6 rounded-xl mb-5 md:mb-2 py-3 border-white text-white"
          >
            {isUploading ? "Uploading..." : "Update"}
          </button>
          <button
            className="border my-5 bg-red-400 text-sm px-6 rounded-xl mb-5 md:mb-2 py-3 border-white text-white"
            onClick={closeForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
