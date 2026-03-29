import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    axios.get("/api/courses")
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCourses([]));
  }, []);

  const isAdmin = user?.role === "admin";

  // Hero content per role
  const hero = () => {
    if (!token) return {
      badge: "🎓 Online Learning Platform",
      headline: <>Learn skills that{" "}<span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>move your career.</span></>,
      sub: "Access expert-led courses built for real-world outcomes. Browse freely — no account needed to explore.",
      cta: (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link to="/signup" style={btnWhite}>Get Started — Free</Link>
          <a href="#courses" style={btnOutline}>Browse Courses ↓</a>
        </div>
      ),
    };
    if (isAdmin) return {
      badge: "⚙️ Admin Dashboard",
      headline: <>Manage your <span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>course catalog.</span></>,
      sub: "Create, edit, and organize courses for your students. Everything you need is right here.",
      cta: (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link to="/add-course" style={btnWhite}>+ New Course</Link>
          <a href="#courses" style={btnOutline}>View All Courses ↓</a>
        </div>
      ),
    };
    return {
      badge: "👋 Welcome back",
      headline: <>Hey, <span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.username || "there"}!</span></>,
      sub: "Ready to learn something new today? Browse all available courses below and keep growing.",
      cta: (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <a href="#courses" style={btnWhite}>Browse Courses ↓</a>
        </div>
      ),
    };
  };

  const btnWhite = {
    padding: "14px 32px", background: "white", color: "#0f0f0f",
    borderRadius: "10px", fontWeight: "700", fontSize: "15px", textDecoration: "none",
  };
  const btnOutline = {
    padding: "14px 32px", background: "transparent", color: "white",
    border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "10px",
    fontWeight: "600", fontSize: "15px", textDecoration: "none",
  };

  const { badge, headline, sub, cta } = hero();

  const sectionTitle = isAdmin ? "All Courses" : token ? "Continue Learning" : "All Courses";

  return (
    <div>
      {/* ── Hero — shown to ALL users ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 55%, #16213e 100%)",
        color: "white",
        padding: "80px 80px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: "60px",
      }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "-100px", right: "200px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(99,102,241,0.18)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "100px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(139,92,246,0.13)", filter: "blur(70px)" }} />

        {/* Left — text */}
        <div style={{ position: "relative", zIndex: 1, flex: "1", maxWidth: "600px" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "6px 18px",
            fontSize: "13px", fontWeight: "600", letterSpacing: "0.5px",
            color: "#c4b5fd", marginBottom: "28px",
          }}>
            {badge}
          </span>

          <h1 style={{
            fontSize: "clamp(36px, 5vw, 62px)",
            fontWeight: "900", lineHeight: 1.08,
            letterSpacing: "-1.5px", marginBottom: "24px",
          }}>
            {headline}
          </h1>

          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, maxWidth: "520px", marginBottom: "40px",
          }}>
            {sub}
          </p>

          {cta}
        </div>

        {/* Right — illustration */}
        <div style={{ position: "relative", zIndex: 1, flex: "0 0 auto" }}>
          <img
            src="https://www.billabonghighschool.com/blogs/wp-content/uploads/2024/02/blog-43-What-is-the-importance-of-the-history-of-education.jpg"
            alt="Education illustration"
            style={{
              width: "480px", maxWidth: "100%",
              borderRadius: "20px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
      </section>

      {/* ── Course Grid ── */}
      <div id="courses" className="px-10 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{sectionTitle}</h2>
          <p className="text-gray-500 mt-1">
            {isAdmin ? "Create and manage your course catalog" : "Find a course and start learning today"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.length > 0
            ? courses.map(course => <CourseCard key={course._id} course={course} />)
            : <p className="text-gray-400 col-span-4">No courses available yet.</p>
          }
        </div>
      </div>
    </div>
  );
}
