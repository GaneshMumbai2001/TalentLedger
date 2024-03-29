import React, { useState } from "react";

export default function RepoList({ repos, onSelectRepo }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="flex justify-center mb-2">
        <input
          type="text"
          placeholder="Search Repositories..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <p className="text-gray-100 font-semibold mb-2">
        Total Repositories: {filteredRepos.length}
      </p>
      <div
        className="bg-white rounded-xl shadow-md overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        <div style={{ padding: "10px" }}>
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className="cursor-pointer p-4 hover:bg-gray-100 border-b last:border-b-0"
            >
              <p className="text-gray-800 hover:text-blue-600">{repo.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
