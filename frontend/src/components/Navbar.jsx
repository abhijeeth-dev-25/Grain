import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBox from "./SearchBox";
import { LogOut, User, PlusCircle, Leaf } from "lucide-react";
import { gsap } from "gsap";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const brandRef = useRef(null);
  const linksRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Full navbar slides down from top
    tl.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }
    )
    // Brand fades in from left
    .fromTo(brandRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    )
    // Search fades in from center
    .fromTo(searchRef.current,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    )
    // Links fade in from right
    .fromTo(linksRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    );

    return () => tl.kill();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = token && user?.role === "admin";

  return (
    <nav
      ref={navRef}
      style={{
        opacity: 0, /* GSAP will animate this to 1 — prevents white flash */
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 60%, #16213e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "72px",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* ── Brand ── */}
      <Link
        ref={brandRef}
        to="/"
        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.25 })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.25 })}
      >
        <div style={{
          width: "36px",
          height: "36px",
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
        }}>
          <Leaf size={18} color="white" />
        </div>
        <span style={{
          fontSize: "20px",
          fontWeight: "900",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "white",
          fontFamily: "'Manrope', sans-serif",
        }}>
          Grain
        </span>
      </Link>

      {/* ── Search ── */}
      <div
        ref={searchRef}
        style={{ flex: 1, maxWidth: "480px", margin: "0 48px" }}
      >
        <SearchBox />
      </div>

      {/* ── Links ── */}
      <div
        ref={linksRef}
        style={{ display: "flex", alignItems: "center", gap: "28px" }}
      >
        {!token ? (
          <>
            <Link
              to="/login"
              style={{
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; gsap.to(e.currentTarget, { y: -2, duration: 0.2 }); }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; gsap.to(e.currentTarget, { y: 0, duration: 0.2 }); }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "white",
                textDecoration: "none",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "700",
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.25 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.25 })}
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            {isAdmin && (
              <Link
                to="/add-course"
                style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "white"; gsap.to(e.currentTarget, { y: -2, duration: 0.2 }); }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; gsap.to(e.currentTarget, { y: 0, duration: 0.2 }); }}
              >
                <PlusCircle size={16} />
                <span>Create Course</span>
              </Link>
            )}

            <Link
              to="/profile"
              style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; gsap.to(e.currentTarget, { y: -2, duration: 0.2 }); }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; gsap.to(e.currentTarget, { y: 0, duration: 0.2 }); }}
            >
              <User size={16} />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "rgba(239,68,68,0.75)", fontSize: "14px", fontWeight: "600", cursor: "pointer", padding: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgb(239,68,68)"; gsap.to(e.currentTarget, { x: 3, duration: 0.2 }); }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(239,68,68,0.75)"; gsap.to(e.currentTarget, { x: 0, duration: 0.2 }); }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
