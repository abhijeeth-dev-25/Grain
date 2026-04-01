import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { token, user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // holds id of course pending delete

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/");
      return;
    }

    axios
      .get("/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("❌ Failed to fetch courses:", err))
      .finally(() => setLoading(false));
  }, [token, user, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading your courses...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
            <p className="text-gray-500 mt-1">Manage your courses</p>
          </div>
          <Link
            to="/add-course"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            <p>You haven't created any courses yet.</p>
            <Link to="/add-course" className="mt-4 inline-block text-blue-600 hover:underline">
              Create your first course →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4 items-start"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🎓</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span>💰 ₹{course.price}</span>
                    <span>📺 {course.episodes?.length || 0} episodes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link
                    to={`/course/${course._id}`}
                    className="text-center text-sm px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-course/${course._id}`}
                    className="text-center text-sm px-4 py-1.5 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition"
                  >
                    Edit
                  </Link>
                  {deleteConfirm === course._id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(course._id)}
                      className="text-sm px-4 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Account Security</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Sign Out
            </button>
            <button
              onClick={() => {
                logoutAll();
                navigate("/");
              }}
              className="px-5 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
            >
              Sign Out from All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
