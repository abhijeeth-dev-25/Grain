import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [courses, setCourses] = useState([]);
  const { user, token } = useAuth();

  // Refs for GSAP
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const illustrationRef = useRef(null);
  const coursesSectionRef = useRef(null);

  useEffect(() => {
    axios.get("/api/courses")
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    // ── Hero Section GSAP Timeline ────────────────────────────────────────────
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge pill drops in
      tl.fromTo(badgeRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.2
      )
      // Headline words reveal (staggered by line)
      .fromTo(headlineRef.current,
        { y: 50, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.9 },
        "-=0.2"
      )
      // Sub text fades in
      .fromTo(subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      )
      // CTA buttons slide up
      .fromTo(ctaRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      )
      // Illustration floats in from right
      .fromTo(illustrationRef.current,
        { x: 60, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Continuous floating animation on illustration
      gsap.to(illustrationRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      // Glow blob parallax on scroll
      gsap.to(".glow-blob-1", {
        y: -60,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      gsap.to(".glow-blob-2", {
        y: -40,
        x: 20,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        }
      });

      // ── Courses Section: ScrollTrigger stagger ──────────────────────────────
      gsap.from(".course-card-anim", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: coursesSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".section-title-anim", {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: coursesSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const isAdmin = user?.role === "admin";

  const hero = () => {
    if (!token) return {
      badge: "🎓 Online Learning Platform",
      headline: (
        <>
          Learn skills that{" "}
          <span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            move your career.
          </span>
        </>
      ),
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
      headline: (
        <>
          Manage your{" "}
          <span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            course catalog.
          </span>
        </>
      ),
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
      headline: (
        <>
          Hey,{" "}
          <span style={{ background: "linear-gradient(90deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {user?.username || "there"}!
          </span>
        </>
      ),
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
    <div ref={heroRef}>
      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 55%, #16213e 100%)",
        color: "white",
        padding: "90px 80px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: "60px",
      }}>
        {/* Glow blobs */}
        <div className="glow-blob-1" style={{ position: "absolute", top: "-100px", right: "200px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(99,102,241,0.18)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="glow-blob-2" style={{ position: "absolute", bottom: "-80px", left: "100px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(139,92,246,0.13)", filter: "blur(70px)", pointerEvents: "none" }} />

        {/* Left — text */}
        <div style={{ position: "relative", zIndex: 1, flex: "1", maxWidth: "600px" }}>
          <span ref={badgeRef} style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "6px 18px",
            fontSize: "13px", fontWeight: "600", letterSpacing: "0.5px",
            color: "#c4b5fd", marginBottom: "28px",
            opacity: 0,
          }}>
            {badge}
          </span>

          <h1 ref={headlineRef} style={{
            fontSize: "clamp(36px, 5vw, 62px)",
            fontWeight: "900", lineHeight: 1.08,
            letterSpacing: "-1.5px", marginBottom: "24px",
            opacity: 0,
          }}>
            {headline}
          </h1>

          <p ref={subRef} style={{
            fontSize: "18px", color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, maxWidth: "520px", marginBottom: "40px",
            opacity: 0,
          }}>
            {sub}
          </p>

          <div ref={ctaRef} style={{ opacity: 0 }}>
            {cta}
          </div>
        </div>

        {/* Right — illustration */}
        <div ref={illustrationRef} style={{ position: "relative", zIndex: 1, flex: "0 0 auto", opacity: 0 }}>
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

      {/* ── Courses Section ── */}
      <div id="courses" ref={coursesSectionRef} className="px-10 py-14">
        <div className="section-title-anim mb-10" style={{ opacity: 0 }}>
          <h2 className="text-3xl font-bold text-gray-900">{sectionTitle}</h2>
          <p className="text-gray-500 mt-1">
            {isAdmin ? "Create and manage your course catalog" : "Find a course and start learning today"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.length > 0
            ? courses.map(course => (
                <div key={course._id} className="course-card-anim" style={{ opacity: 0 }}>
                  <CourseCard course={course} />
                </div>
              ))
            : <p className="text-gray-400 col-span-4">No courses available yet.</p>
          }
        </div>
      </div>
    </div>
  );
}
