function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(weeks / 4.345); // Average weeks in a month
  const years = Math.round(months / 12);

  if (seconds < 60) return `${seconds} seconds ago`;
  else if (minutes < 60) return `${minutes} minutes ago`;
  else if (hours < 24) return `${hours} hours ago`;
  else if (days < 7) return `${days} days ago`;
  else if (weeks < 4) return `${weeks} weeks ago`;
  else if (months < 12) return `${months} months ago`;
  else return `${years} years ago`;
}

export default function RepoDetails({ repo, onBack }) {
  return (
    <div className="max-w-md mx-auto repocard rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4">
      <div className="md:flex">
        <div className="px-8  font-semibold py-4">
          <div className="flex justify-between">
            <div>
              <p className="text-black">Visibility: {repo.visibility}</p>
            </div>
            <div className="flex">
              {repo &&
                repo.contributors.map((contributor) => (
                  <a
                    key={contributor.name}
                    href={`https://github.com/${contributor.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className=""
                      src={contributor.profile_url}
                      alt={contributor.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </a>
                ))}
            </div>
          </div>
          <p className="text-black">Updated: {timeAgo(repo.updated_at)}</p>
          <p className="text-black">Forks: {repo.forks_count}</p>
          <p className="text-black">Open Issues: {repo.open_issues_count}</p>
          <div className="mt-2">
            <h2 className=" text-black">
              Languages used: {repo.languages.join(", ")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
