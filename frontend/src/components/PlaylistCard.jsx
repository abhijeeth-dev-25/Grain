import React from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Play, CheckCircle2 } from "lucide-react";

/**
 * Premium Playlist Card with Access Indicators
 */
const PlaylistCard = ({ episodes, onSelectEpisode, selectedEpisode }) => {
  const { token } = useAuth();
  const isAuthenticated = !!token;

  if (!episodes || episodes.length === 0)
    return (
      <div style={{
        padding: "32px", background: "white", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", color: "#6b7280", textAlign: "center",
        border: "1px solid #f1f5f9"
      }}>
        No episodes available
      </div>
    );

  return (
    <div style={{
      background: "white", borderRadius: "24px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden", border: "1px solid #f1f5f9"
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 28px", background: "#fcfdff", borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: "900", color: "#0f0f0f", margin: 0, letterSpacing: "-0.3px" }}>Curriculum</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0", fontWeight: "600" }}>Mastering the craft</p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "#6366f1", background: "#eef2ff", padding: "4px 12px", borderRadius: "999px", textTransform: "uppercase" }}>
          {episodes.length} Lessons
        </span>
      </div>

      {/* List */}
      <ul style={{ listStyle: "none", padding: "8px", margin: 0, overflowY: "auto", flex: 1 }} className="custom-scrollbar">
        {episodes.map((ep, index) => {
          const isSelected = selectedEpisode?._id === ep._id || selectedEpisode?.title === ep.title;
          
          return (
            <li
              key={index}
              onClick={() => onSelectEpisode(ep)}
              style={{
                padding: "16px 20px", cursor: "pointer", borderRadius: "16px",
                marginBottom: "4px",
                background: isSelected ? "#f5f3ff" : "transparent",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative"
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc" }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent" }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {/* Status Icon */}
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isSelected ? "#7c3aed" : "#f1f5f9",
                  color: isSelected ? "white" : "#94a3b8",
                  flexShrink: 0, transition: "all 0.3s"
                }}>
                  {isSelected ? (
                    <Play size={14} fill="currentColor" />
                  ) : !isAuthenticated && index > 0 ? (
                    <Lock size={12} />
                  ) : (
                    <span style={{ fontSize: "11px", fontWeight: "900", fontFamily: "monospace" }}>
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h4 style={{
                      fontSize: "14px", fontWeight: isSelected ? "800" : "600",
                      color: isSelected ? "#4c1d95" : "#1e293b", margin: 0,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}>
                      {ep.title}
                    </h4>
                    {!isAuthenticated && index > 0 && isSelected && (
                       <Lock size={10} className="text-red-400" />
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <span style={{ fontSize: "10px", color: isSelected ? "#a78bfa" : "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      {ep.duration || "12:00"}
                    </span>
                    {ep.isFree || index === 0 ? (
                      <span style={{ fontSize: "9px", background: "#f0fdf4", color: "#166534", padding: "1px 6px", borderRadius: "4px", fontWeight: "900", textTransform: "uppercase" }}>Preview</span>
                    ) : !isAuthenticated ? (
                       <span style={{ fontSize: "9px", background: "#fff1f2", color: "#9f1239", padding: "1px 6px", borderRadius: "4px", fontWeight: "900", textTransform: "uppercase" }}>Locked</span>
                    ) : null}
                  </div>
                </div>

                {isSelected && (
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 10px #7c3aed" }} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlaylistCard;
