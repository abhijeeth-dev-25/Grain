import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending signup request:", form);
      const res = await axios.post("/api/auth/signup", form);
      console.log("Signup response:", res.data);
      // After signup, automatically log the user in by calling the login endpoint
      try {
        const loginRes = await axios.post("/api/auth/login", { email: form.email, password: form.password });
        console.log("Auto-login response:", loginRes.data);
        // login expects an object with user and token (AuthContext will set what's provided).
        login(loginRes.data);
        navigate("/");
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr.response?.data || loginErr.message);
        // If auto-login fails, still navigate to login page so user can sign in manually
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="w-full mb-4 p-2 border rounded bg-white"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Student</option>
          <option value="admin">Instructor / Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Signup
        </button>
        <p className="text-sm mt-3 text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
