import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setProfile(null);
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("/api/profile", headers)
      .then(res => setProfile(res.data))
      .catch(err => console.error("Profile fetch error:", err))
      .finally(() => setLoading(false));

    axios.get("/api/wishlist", headers)
      .then(res => setWishlist(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Wishlist fetch error:", err);
        setWishlist([]);
      });
  }, [token]);

  return (
    <div className="flex p-8 min-h-screen gap-6">
      {/* Left column: 40% */}
      <div className="w-2/5 bg-white shadow-md p-6 rounded-lg flex flex-col justify-between">
        <div>
          {loading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <>
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-gray-600">{profile.email}</p>

              <div className="mt-6">
                <h3 className="font-semibold">Account</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li><Link to="/" className="text-blue-600 hover:underline">Wishlist</Link></li>
                  {user?.role === "admin" && (
                    <li><Link to="/settings" className="text-blue-600 hover:underline">Settings</Link></li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p>No profile data. Please log in.</p>
          )}
        </div>

        <div>
          <button
            onClick={logout}
            className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>

          <div className="mt-6 text-xs text-gray-400">
            <p className="font-semibold">EduApp</p>
            <p>Learn. Build. Grow.</p>
          </div>
        </div>
      </div>

      {/* Right column: 60% */}
      <div className="w-3/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlist.map(course => (
              <div key={course._id} className="bg-white p-4 rounded-lg shadow">
                {course.imageUrl && (
                  <img src={course.imageUrl} alt={course.title} className="w-full h-36 object-cover rounded" />
                )}
                <p className="font-bold mt-2">{course.title}</p>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="mt-2 font-semibold">${course.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
