import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBox from "./SearchBox";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white">
      <Link to="/" className="text-2xl font-bold">EduApp</Link>

      <div className="grow mx-8 max-w-lg bg-white rounded-lg">
        <SearchBox />
      </div>

      <div className="flex items-center space-x-4">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/add-course" className="hover:text-gray-300">Add Course</Link>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
