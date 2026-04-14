import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { token, user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  
  // Tabs: 'profile', 'wishlist', 'courses'
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profileData, setProfileData] = useState({ username: "", email: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  
  // Admin Courses State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, wRes] = await Promise.all([
          axios.get("/api/profile", headers),
          axios.get("/api/wishlist", headers),
        ]);
        
        setProfileData(pRes.data);
        setWishlist(wRes.data);

        if (isAdmin) {
          const cRes = await axios.get("/api/courses/my-courses", headers);
          setCourses(cRes.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch settings data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAdmin, navigate]);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await axios.put("/api/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Wishlist Removal
  const handleRemoveFromWishlist = async (courseId) => {
    try {
      await axios.delete(`/api/wishlist/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== courseId));
    } catch (err) {
      alert("❌ Failed to remove from wishlist");
    }
  };

  // Handle Course Deletion (Admin)
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400 bg-[#f1f5f9]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600 mr-3"></div>
      Loading Settings...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f0f0f] p-6 md:p-12 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight mb-2 text-[#0f0f0f]">
            Account Settings
          </h1>
          <p className="text-[#6b7280] font-medium">Manage your personal information and browser preferences.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 w-fit mx-auto md:mx-0 shadow-sm">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "profile" ? "bg-[#0f0f0f] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "wishlist" ? "bg-[#0f0f0f] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Wishlist
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab("courses")}
              className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "courses" ? "bg-[#0f0f0f] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
            >
              Courses
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-[#0f0f0f] flex items-center gap-3">
                  <span className="bg-indigo-50 p-2 rounded-lg">👤</span>
                  Personal Details
                </h2>
                <p className="text-sm text-gray-400 mt-1">Update your basic account information.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
                  <input 
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full bg-[#0f0f0f] text-white font-bold py-4 rounded-xl hover:bg-black/90 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-black/10"
                >
                  {isUpdatingProfile ? "Processing..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-[#0f0f0f] flex items-center gap-3">
                  <span className="bg-red-50 p-2 rounded-lg">❤️</span>
                  Wishlist Settings
                </h2>
                <p className="text-sm text-gray-400 mt-1">Manage courses you've saved for later.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="text-3xl mb-4">✨</div>
                  <p className="text-gray-500 font-medium">Your wishlist is looking empty.</p>
                  <Link to="/" className="text-indigo-600 hover:text-indigo-700 transition mt-3 inline-block font-bold">Discover Courses →</Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {wishlist.map((course) => (
                    <div key={course._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors group">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={course.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-[#0f0f0f]">{course.title}</h3>
                        <p className="text-[12px] text-indigo-600 font-bold">₹{course.price}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromWishlist(course._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 text-xs font-bold px-4 py-2 rounded-lg border border-red-100 bg-white hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Courses Tab */}
          {activeTab === "courses" && isAdmin && (
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0f0f0f] flex items-center gap-3">
                    <span className="bg-amber-50 p-2 rounded-lg">🎓</span>
                    My Content
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Create and manage your courses.</p>
                </div>
                <Link to="/add-course" className="bg-[#0f0f0f] text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-black/90 transition shadow-lg shadow-black/5">
                  + Create New
                </Link>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500">You haven't authored any courses yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course._id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex gap-5 items-center hover:shadow-md transition-shadow">
                      <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={course.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-[#0f0f0f]">{course.title}</h3>
                        <div className="flex gap-4 mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                          <span>₹{course.price}</span>
                          <span className="text-gray-300">•</span>
                          <span>{course.episodes?.length || 0} Lessons</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/edit-course/${course._id}`} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                          ✏️
                        </Link>
                        {deleteConfirm === course._id ? (
                          <div className="flex gap-1 overflow-hidden rounded-xl border border-red-100">
                            <button onClick={() => handleDeleteCourse(course._id)} className="px-4 py-2 bg-red-600 text-white text-[11px] font-black uppercase">Del</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-100 text-gray-600 text-[11px] font-black uppercase">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(course._id)} className="p-3 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition">
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-8 items-center justify-between">
          <div className="flex gap-6">
            <button 
              onClick={() => { logout(); navigate("/"); }}
              className="text-xs font-extrabold text-gray-400 hover:text-indigo-600 transition uppercase tracking-widest"
            >
              Log Out
            </button>
            <button 
              onClick={() => { logoutAll(); navigate("/"); }}
              className="text-xs font-extrabold text-red-400/80 hover:text-red-500 transition uppercase tracking-widest"
            >
              End All Sessions
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">
              Grain Education • Account Center
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
