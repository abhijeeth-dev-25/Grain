import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLink = {
  display: "flex", alignItems: "center", gap: "8px",
  padding: "10px 14px", borderRadius: "8px",
  fontSize: "14px", fontWeight: "500",
  color: "#374151", textDecoration: "none",
};

export default function Profile() {
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    setLoading(true);

    Promise.all([
      axios.get("/api/profile", headers).catch(() => null),
      axios.get("/api/wishlist", headers).catch(() => null),
    ]).then(([pRes, wRes]) => {
      if (pRes) setProfile(pRes.data);
      if (wRes) setWishlist(Array.isArray(wRes.data) ? wRes.data : []);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleLogout = () => { logout(); navigate("/"); };

  const initials = (profile?.username || user?.username || "?")
    .slice(0, 2).toUpperCase();
  const isAdmin = user?.role === "admin";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f1f5f9",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
    }}>
      <div style={{ display: "flex", width: "100%", gap: "0", alignItems: "stretch" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          width: "280px", flexShrink: 0,
          background: "white",
          borderRadius: "0",
          boxShadow: "2px 0 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
        }}>
          {/* Colour strip */}
          <div style={{
            height: "100px",
            background: "linear-gradient(135deg, #0f0f0f, #1e1b4b)",
          }} />

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "-34px", paddingBottom: "6px" }}>
            <div style={{
              width: "68px", height: "68px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", fontWeight: "800", color: "white",
              border: "4px solid white",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}>
              {initials}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "0 20px 20px", textAlign: "center" }}>
            {loading ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading…</p>
            ) : profile ? (
              <>
                <p style={{ fontWeight: "800", fontSize: "17px", color: "#0f0f0f", margin: "0 0 2px" }}>
                  {profile.username}
                </p>
                <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "10px" }}>{profile.email}</p>
                <span style={{
                  display: "inline-block",
                  padding: "3px 12px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: "700",
                  background: isAdmin ? "#fef3c7" : "#ede9fe",
                  color: isAdmin ? "#92400e" : "#5b21b6",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  {isAdmin ? "Admin" : "Student"}
                </span>
              </>
            ) : (
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Please log in</p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #f1f5f9" }} />

          {/* Nav links */}
          <div style={{ padding: "14px 12px" }}>
            <p style={{
              fontSize: "10px", fontWeight: "700", color: "#9ca3af",
              letterSpacing: "1px", textTransform: "uppercase",
              padding: "0 10px", marginBottom: "6px",
            }}>
              Account
            </p>
            {!isAdmin && <a href="#wishlist" style={navLink}>❤️ My Wishlist</a>}
            {isAdmin && <Link to="/add-course" style={navLink}>＋ New Course</Link>}
            <Link to="/settings" style={navLink}>⚙️ Settings</Link>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #f1f5f9" }} />

          {/* Logout */}
          <div style={{ padding: "14px 16px" }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", padding: "10px",
                background: "#0f0f0f", color: "white",
                border: "none", borderRadius: "10px",
                fontWeight: "700", fontSize: "14px", cursor: "pointer",
              }}
              onMouseEnter={e => e.target.style.background = "#1f2937"}
              onMouseLeave={e => e.target.style.background = "#0f0f0f"}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, padding: "40px 48px", minWidth: 0 }}>
          {isAdmin ? (
            <div style={{
              background: "white", borderRadius: "18px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              padding: "48px", textAlign: "center",
            }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>⚙️</p>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f0f0f" }}>Admin Panel</h3>
              <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px", maxWidth: "360px", margin: "8px auto 0" }}>
                Create and manage courses from the catalog below.
              </p>
              <Link to="/add-course" style={{
                display: "inline-block", marginTop: "24px",
                padding: "12px 28px", background: "#0f0f0f",
                color: "white", borderRadius: "10px",
                fontWeight: "700", textDecoration: "none", fontSize: "14px",
              }}>
                + Create New Course
              </Link>
            </div>
          ) : (
            <div id="wishlist">
              {/* Header row */}
              <div style={{
                background: "white", borderRadius: "18px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                padding: "20px 24px", marginBottom: "20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <h2 style={{ fontWeight: "800", fontSize: "18px", color: "#0f0f0f", margin: 0 }}>My Wishlist</h2>
                  <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
                    {wishlist.length > 0 ? `${wishlist.length} saved course${wishlist.length > 1 ? "s" : ""}` : "No courses saved yet"}
                  </p>
                </div>
                <Link to="/" style={{
                  padding: "9px 20px", background: "#0f0f0f",
                  color: "white", borderRadius: "8px",
                  fontWeight: "600", fontSize: "13px", textDecoration: "none",
                }}>
                  Browse More
                </Link>
              </div>

              {/* Grid */}
              {loading ? (
                <p style={{ color: "#9ca3af", padding: "20px" }}>Loading wishlist…</p>
              ) : wishlist.length === 0 ? (
                <div style={{
                  background: "white", borderRadius: "18px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  padding: "60px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "40px", marginBottom: "12px" }}>❤️</p>
                  <h3 style={{ fontWeight: "800", fontSize: "18px", color: "#0f0f0f", margin: 0 }}>Nothing saved yet</h3>
                  <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "6px" }}>
                    Tap the heart on any course to add it here.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }}>
                  {wishlist.map(course => (
                    <Link
                      key={course._id}
                      to={`/course/${course._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          background: "white", borderRadius: "14px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                          overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                        }}
                      >
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          style={{ width: "100%", height: "120px", objectFit: "cover" }}
                        />
                        <div style={{ padding: "12px 14px" }}>
                          <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f0f0f", margin: "0 0 4px" }}>
                            {course.title}
                          </p>
                          <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px", lineHeight: 1.4 }}>
                            {course.description?.slice(0, 50)}{course.description?.length > 50 ? "…" : ""}
                          </p>
                          <p style={{ fontWeight: "800", fontSize: "14px", color: "#7c3aed", margin: 0 }}>
                            ₹{course.price || "Free"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
