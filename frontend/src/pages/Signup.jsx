import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Book, Pencil, Sparkles, UserPlus, Mail, Lock, User, Briefcase } from "lucide-react";
import { gsap } from "gsap";

/**
 * Premium Signup Page for 'Grain - An Educational Ecosystem'
 * Matches the 'Grain Ethereal' Login Page branding and animations.
 */
export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // GSAP Refs
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const motifsRef = useRef([]);

  useEffect(() => {
    // ── Entrance Animations ───────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      // 1. Card entry
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      });

      // 2. Identity elements (Left panel)
      gsap.from(".identity-element", {
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.1
      });

      // 3. Floating motifs idle
      motifsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.to(el, {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-10, 10)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax effect for motifs
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX - window.innerWidth / 2) / 30;
    const yPos = (clientY - window.innerHeight / 2) / 30;

    gsap.to(".parallax-motif", {
      x: xPos,
      y: yPos,
      duration: 1,
      ease: "power1.out",
      stagger: 0.05
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Step 1: Register Account
      await axios.post("/api/auth/signup", form);
      
      // Step 2: Auto-Login for seamless UX
      try {
        const loginRes = await axios.post("/api/auth/login", { 
          email: form.email, 
          password: form.password 
        });
        login(loginRes.data);
        navigate("/");
      } catch (loginErr) {
        // If auto-login fails, redirect to login page
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Academic registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex min-h-screen bg-gray-50/10 overflow-hidden font-sans select-none"
    >
      {/* ── Left Side: Grain Identity Panel (Synchronized with Login) ──────────────── */}
      <div className="hidden lg:flex flex-[1.6] bg-gradient-to-br from-[#120021] via-[#21004a] to-[#2e0052] flex-col p-16 relative overflow-hidden items-start justify-center">
        {/* Animated Motifs */}
        <div className="absolute inset-0 z-0">
          {[GraduationCap, Book, Pencil, Sparkles].map((Icon, idx) => (
            <div 
              key={idx}
              ref={el => motifsRef.current[idx] = el}
              className="parallax-motif absolute text-white/5 opacity-10 filter blur-[1px]"
              style={{
                top: `${20 + idx * 25}%`,
                left: `${15 + idx * 25}%`,
                transform: `scale(${1.5 + idx * 0.5})`
              }}
            >
              <Icon size={180} />
            </div>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full filter blur-[1px] animate-pulse opacity-20" />
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="identity-element flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🌿</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-widest uppercase opacity-80">Grain</span>
          </div>
          
          <h1 className="identity-element text-6xl font-extrabold text-white leading-tight">
            Begin Your <br />
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">Academic Odyssey.</span>
          </h1>
          
          <p className="identity-element text-lg text-white/60 leading-relaxed max-w-sm">
            Join a global community of lifelong learners and industry masters. Expert knowledge, accessible anywhere.
          </p>
        </div>
      </div>

      {/* ── Right Side: Ethereal Signup card ──────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white lg:bg-[#f8f9fa] relative overflow-y-auto">
        <div className="lg:hidden absolute top-8 text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl">🌿</span>
            </div>
            <h2 className="text-xl font-bold tracking-widest uppercase opacity-40">Grain</h2>
        </div>

        <div ref={cardRef} className="w-full max-w-sm glass-card p-10 rounded-3xl lg:bg-white lg:border-none lg:shadow-2xl my-12">
          <div className="space-y-6 mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[var(--on-surface)] leading-tight tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Join the academy and unlock your potential.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border-l-4 border-red-400 text-red-600 text-xs font-semibold rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5 group">
              <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                <User size={12} />
                Username
              </label>
              <input
                type="text"
                placeholder="FutureMaster25"
                required
                className="input-ethereal"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 group">
              <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                <Mail size={12} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@university.edu"
                required
                className="input-ethereal"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 group">
              <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                <Lock size={12} />
                Secret Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="input-ethereal"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Role / Type */}
            <div className="space-y-1.5 group">
              <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                <Briefcase size={12} />
                Academic Residency
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input-ethereal cursor-pointer appearance-none"
              >
                <option value="user">Student — Master Skills</option>
                <option value="admin">Instructor — Share Wisdom</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-8 shadow-[0_10px_30px_rgba(75,0,130,0.15)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Initiate Membership
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400 font-bold tracking-tight">
            Already have a residency? {" "}
            <Link
              to="/login"
              className="text-[var(--primary-container)] hover:underline hover:scale-110 active:scale-95 inline-block transition-all underline-offset-4 decoration-2"
            >
              Sign In
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-[10px] uppercase tracking-widest font-black text-gray-300 pb-8">
           © 2026 Grain Academic Labs — Secure Registration
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap');
      `}</style>
    </div>
  );
}
