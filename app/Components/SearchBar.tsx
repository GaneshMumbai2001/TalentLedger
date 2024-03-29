export default function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    onSearch(username);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center p-4">
      <input
        name="username"
        type="text"
        placeholder="Enter GitHub Username"
        className="border rounded-l p-2"
      />
      <button type="submit" className="bg-blue-500 text-white rounded-r px-4">
        Search
      </button>
    </form>
  );
}
