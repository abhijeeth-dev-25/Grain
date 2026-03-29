import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/signup", form);
      try {
        const loginRes = await axios.post("/api/auth/login", { email: form.email, password: form.password });
        login(loginRes.data);
        navigate("/");
      } catch {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div
        style={{
          flex: "1",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 50px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.12)",
            filter: "blur(60px)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "340px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "white",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
              boxShadow: "0 8px 32px rgba(255,255,255,0.1)",
            }}
          >
            <span style={{ fontSize: "26px" }}>🎓</span>
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-1px",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            Start your
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              journey.
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.6 }}>
            Join thousands of learners building real skills with expert-led courses. It only takes a minute to get started.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div
        style={{
          flex: "1",
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#0f0f0f",
              marginBottom: "6px",
              letterSpacing: "-0.5px",
            }}
          >
            Create an account
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "36px" }}>
            Fill in your details to get started for free
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="johndoe"
                required
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#0f0f0f")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#0f0f0f")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#0f0f0f")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Role */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                I am a...
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ ...inputStyle, color: "#374151", cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "#0f0f0f")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              >
                <option value="user">Student</option>
                <option value="admin">Instructor / Admin</option>
              </select>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#374151" : "#0f0f0f",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#1f2937")}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#0f0f0f")}
              onMouseDown={(e) => (e.target.style.transform = "scale(0.99)")}
              onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#0f0f0f", fontWeight: "700", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
