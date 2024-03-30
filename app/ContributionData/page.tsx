"use client";
import React, { useState } from "react";
import SearchBar from "../Components/SearchBar";
import RepoList from "../Components/RepoList";
import RepoDetails from "../Components/RepoDetails";
export default function Page() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const fetchRepos = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://talentledger-be.vercel.app/api/user/${username}/repos`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setRepos(data.repositories);

      if (data.repositories.length > 0) {
        setOwnerInfo({
          login: data.user.login,
          avatar_url: data.user.avatar_url,
          bio: data.user.bio,
          languagePercentages: data.user.languagePercentages,
          most_used_languages: data.user.most_used_languages.join(", "),
        });
      } else {
        setOwnerInfo(null);
      }
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("lang", ownerInfo?.languagePercentages);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
  };
  const handleBack = () => {
    setSelectedRepo(null);
  };

  return (
    <div className="bg-[#7752FE] min-h-screen pb-5">
      <SearchBar onSearch={fetchRepos} />

      {isLoading && <div className="text-center">Loading the data...</div>}
      {error && <div className="text-red-500 text-center">Error: {error}</div>}

      {!isLoading && ownerInfo && (
        <div className="flex flex-col items-center ">
          <img
            src={ownerInfo.avatar_url}
            alt={ownerInfo.login}
            className="w-20 h-20 rounded-full border-2 border-white"
          />
          <h2 className="text-xl text-gray-100 font-bold mt-2">
            {ownerInfo.login}
          </h2>
          <p className="text-gray-200 text-center mx-5 md:mx-60 mt-1">
            {ownerInfo.bio}
          </p>
          <p className="text-gray-200 mx-5 mt-1">
            <span className="font-bold">Most Used Languages:</span>{" "}
            {ownerInfo.most_used_languages}
          </p>
        </div>
      )}
      <div className="mx-5">
        {!selectedRepo && !error && !isLoading && ownerInfo && (
          <RepoList repos={repos} onSelectRepo={handleSelectRepo} />
        )}
        {selectedRepo && (
          <RepoDetails repo={selectedRepo} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
