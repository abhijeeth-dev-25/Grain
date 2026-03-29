import React from "react";

const PlaylistCard = ({ episodes, onSelectEpisode, selectedEpisode }) => {
  if (!episodes || episodes.length === 0)
    return (
      <div style={{
        padding: "32px", background: "white", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", color: "#6b7280", textAlign: "center"
      }}>
        No episodes available
      </div>
    );

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden", border: "1px solid #f1f5f9"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f0f0f", margin: 0 }}>Course Curriculum</h3>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", background: "#e2e8f0", padding: "2px 8px", borderRadius: "999px" }}>
          {episodes.length} Episodes
        </span>
      </div>

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
        {episodes.map((ep, index) => {
          const isSelected = selectedEpisode?._id === ep._id || selectedEpisode?.title === ep.title;
          return (
            <li
              key={index}
              onClick={() => onSelectEpisode(ep)}
              style={{
                padding: "16px 24px", cursor: "pointer", borderBottom: "1px solid #f1f5f9",
                background: isSelected ? "#f5f3ff" : "white",
                borderLeft: isSelected ? "4px solid #7c3aed" : "4px solid transparent",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc" }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white" }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{
                  color: isSelected ? "#7c3aed" : "#9ca3af",
                  fontSize: "13px", fontWeight: "800",
                  fontFamily: "monospace", marginTop: "2px"
                }}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <h4 style={{
                    fontSize: "14px", fontWeight: isSelected ? "700" : "500",
                    color: isSelected ? "#5b21b6" : "#374151", margin: "0 0 4px"
                  }}>
                    {ep.title}
                  </h4>
                  {ep.description && (
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>
                      {ep.description.length > 60 ? ep.description.slice(0, 60) + "..." : ep.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlaylistCard;
