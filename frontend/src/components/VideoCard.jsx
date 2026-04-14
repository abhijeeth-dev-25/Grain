import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, PlayCircle, ShieldCheck } from "lucide-react";

/**
 * Premium Video Card with Content Gating
 * Features: Authenticated playback, Premium "Locked" UI for guests.
 */
const VideoCard = ({ episode, course }) => {
  const { token } = useAuth();
  const isAuthenticated = !!token;

  if (!episode)
    return <div style={{
      padding: "60px", background: "white", borderRadius: "24px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.04)", color: "#6b7280", textAlign: "center",
      minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "16px",
      border: "1px dashed #e2e8f0"
    }}>
      <div className="mb-4 bg-gray-50 p-4 rounded-full text-indigo-500">
        <PlayCircle size={32} />
      </div>
      <p className="font-bold text-gray-800">Ready to start?</p>
      <p className="text-sm mt-1">Select an episode from the curriculum to begin your session.</p>
    </div>;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
      if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
      return url;
    } catch (err) {
      return "";
    }
  };

  const courseImage = course?.imageUrl || episode.imageUrl || "https://via.placeholder.com/100x100?text=Course";
  const courseTitle = course?.title || episode.courseTitle || "Untitled Course";

  return (
    <div style={{
      background: "white", borderRadius: "24px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.06)", overflow: "hidden",
      display: "flex", flexDirection: "column", height: "100%", border: "1px solid #f1f5f9"
    }}>
      {/* Video Player Header */}
      <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
          <img
            src={courseImage || undefined} alt={courseTitle}
            style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <div>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "#7c3aed", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {courseTitle}
            </span>
            <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f0f0f", margin: "2px 0 0", letterSpacing: "-0.5px" }}>
              {episode.title}
            </h2>
          </div>
        </div>
        {!isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", padding: "6px 12px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
            <Lock size={12} className="text-red-500" />
            <span style={{ fontSize: "10px", fontWeight: "900", color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>Limited Preview</span>
          </div>
        )}
      </div>

      {/* Video Iframe Container / Locked Wall */}
      <div style={{ width: "100%", background: "#050505", position: "relative", paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
        {isAuthenticated ? (
          episode.videoUrl ? (
            <iframe
              src={getEmbedUrl(episode.videoUrl) || undefined}
              title={episode.title}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
              <p>No video available for this episode.</p>
            </div>
          )
        ) : (
          /* Premium Locked UI */
          <div style={{ 
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, rgba(15,15,20,0.85) 0%, rgba(5,5,10,0.95) 100%)",
            backdropFilter: "blur(12px)", padding: "40px", textAlign: "center", color: "white"
          }}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", background: "rgba(124,58,237,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px",
              border: "1px solid rgba(124,58,237,0.2)", boxShadow: "0 0 40px rgba(124,58,237,0.15)"
            }}>
              <Lock size={32} className="text-indigo-400" />
            </div>
            
            <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "12px", letterSpacing: "-0.5px" }}>
              Laboratory Access Required 🧪
            </h3>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", maxWidth: "420px", fontWeight: "500", lineHeight: 1.6 }}>
              Unlock full high-fidelity streaming, interactive resources, and project files by joining the Grain community.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link 
                to="/signup" 
                style={{ 
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)", 
                  color: "white", textDecoration: "none", padding: "14px 40px", borderRadius: "12px", 
                  fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px",
                  boxShadow: "0 10px 25px rgba(124,58,237,0.3)"
                }}
              >
                Get Started for Free
              </Link>
              <Link 
                to="/login" 
                style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}
              >
                Already have an account? <span style={{ color: "white", textDecoration: "underline" }}>Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: "32px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={14} className="text-indigo-600" />
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: "900", color: "#0f0f0f", textTransform: "uppercase", letterSpacing: "0.5px" }}>Curriculum Context</h3>
        </div>
        <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.8, margin: 0, fontWeight: "500" }}>
          {episode.description || "In this lesson, we explore the core principles of the craft. Deep-dive into technical workflows and artistic execution."}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
