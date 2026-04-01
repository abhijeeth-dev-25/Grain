import React from "react";

const VideoCard = ({ episode, course }) => {
  if (!episode)
    return <div style={{
      padding: "60px", background: "white", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)", color: "#6b7280", textAlign: "center",
      minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
    }}>
      Select an episode from the curriculum to start watching.
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
      background: "white", borderRadius: "16px",
      boxShadow: "0 4px 32px rgba(0,0,0,0.08)", overflow: "hidden",
      display: "flex", flexDirection: "column", height: "100%", border: "1px solid #f1f5f9"
    }}>
      {/* Video Player Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src={courseImage || undefined} alt={courseTitle}
          style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        />
        <div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#7c3aed", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {courseTitle}
          </span>
          <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f0f0f", margin: "4px 0 0", letterSpacing: "-0.5px" }}>
            {episode.title}
          </h2>
        </div>
      </div>

      {/* Video Iframe Container */}
      <div style={{ width: "100%", background: "#0f0f0f", position: "relative", paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
        {episode.videoUrl ? (
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
        )}
      </div>

      {/* Description */}
      <div style={{ padding: "32px", flex: 1, overflowY: "auto" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f0f0f", marginBottom: "12px" }}>About this episode</h3>
        <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
          {episode.description || "No description provided."}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
