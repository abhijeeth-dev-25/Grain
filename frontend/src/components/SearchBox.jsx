import { useState } from "react";
import axios from "axios";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      try {
        const res = await axios.get(`/api/courses/search?name=${value}`);
        setResults(res.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search courses..."
        value={query}
        onChange={handleSearch}
        className="w-full px-4 py-2 rounded-lg text-black"
      />
      {results.length > 0 && (
        <div className="absolute z-50 bg-white text-black w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((course) => (
            <div key={course._id} className="p-2 hover:bg-gray-100 cursor-pointer">
              {course.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
