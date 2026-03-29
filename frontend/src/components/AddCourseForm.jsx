import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddCourseForm({ courseId }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!courseId);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    episodes: [],
  });

  const isEditing = !!courseId;

  useEffect(() => {
    if (isEditing) {
      axios.get(`/api/courses/${courseId}`)
        .then((res) => {
          const fetchCourse = res.data.course || res.data;
          setCourse({
            title: fetchCourse.title || "",
            description: fetchCourse.description || "",
            price: fetchCourse.price || "",
            imageUrl: fetchCourse.imageUrl || "",
            episodes: fetchCourse.episodes || [],
          });
        })
        .catch((err) => {
          console.error("Error fetching course for edit", err);
          alert("Failed to load course details.");
        })
        .finally(() => setLoading(false));
    }
  }, [courseId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...course,
        price: Number(course.price) || 0,
        episodes: Array.isArray(course.episodes) ? course.episodes : [],
      };

      if (isEditing) {
        await axios.put(`/api/courses/${courseId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Course updated!");
        navigate(`/course/${courseId}`);
      } else {
        const res = await axios.post("/api/courses/add", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Course added!");
        navigate(`/course/${res.data.course._id}`);
      }
    } catch (err) {
      console.error(err);
      alert(isEditing ? "❌ Error updating course" : "❌ Error adding course");
    }
  };

  const addEpisode = () => {
    setCourse(prev => ({ ...prev, episodes: [...(prev.episodes || []), { title: "", description: "", imageUrl: "", videoUrl: "" }] }));
  };

  const updateEpisode = (index, field, value) => {
    setCourse(prev => {
      const eps = [...(prev.episodes || [])];
      eps[index] = { ...eps[index], [field]: value };
      return { ...prev, episodes: eps };
    });
  };

  const removeEpisode = (index) => {
    setCourse(prev => {
      const eps = [...(prev.episodes || [])];
      eps.splice(index, 1);
      return { ...prev, episodes: eps };
    });
  };

  if (loading) return <div style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Loading course...</div>;

  const btnBlack = {
    background: "#0f0f0f", color: "white", padding: "12px 24px",
    borderRadius: "8px", fontWeight: "600", fontSize: "14px",
    border: "none", cursor: "pointer", transition: "background 0.2s"
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", fontSize: "15px",
    color: "#0f0f0f", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      {/* Header snippet */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#0f0f0f", letterSpacing: "-0.5px", margin: "0 0 8px" }}>
          {isEditing ? "Edit Course" : "Create New Course"}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>
          {isEditing ? "Update details for your curriculum below." : "Fill out the details below to add a new course to your catalog."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "white", padding: "40px",
        borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>
        {!token && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px", fontWeight: "500" }}>
            You must be logged in to {isEditing ? "edit" : "add"} a course.
          </div>
        )}

        {/* ── Basic Info ── */}
        <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>COURSE TITLE</label>
            <input
              type="text" placeholder="e.g. Advanced React Patterns" style={inputStyle}
              value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} required
              onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>DESCRIPTION</label>
            <textarea
              placeholder="What will students learn?" style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} required
              onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>COVER IMAGE URL</label>
              <input
                type="url" placeholder="https://..." style={inputStyle}
                value={course.imageUrl} onChange={(e) => setCourse({ ...course, imageUrl: e.target.value })}
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>PRICE (₹)</label>
              <input
                type="number" placeholder="0 for Free" style={inputStyle} min="0" step="any"
                value={course.price} onChange={(e) => setCourse({ ...course, price: e.target.value })} required
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "1px", background: "#f1f5f9", margin: "40px -40px" }} />

        {/* ── Curriculum ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f0f0f", margin: "0 0 4px" }}>Curriculum</h3>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Add video episodes for your students.</p>
            </div>
            <button
              type="button" onClick={addEpisode}
              style={{
                background: "#f1f5f9", color: "#0f0f0f", padding: "10px 18px",
                borderRadius: "8px", fontWeight: "600", fontSize: "13px", border: "none", cursor: "pointer"
              }}
              onMouseEnter={e => e.target.style.background = "#e2e8f0"}
              onMouseLeave={e => e.target.style.background = "#f1f5f9"}
            >
              + Add Episode
            </button>
          </div>

          {course.episodes && course.episodes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {course.episodes.map((ep, idx) => (
                <div key={idx} style={{
                  background: "#fafafa", border: "1px solid #f1f5f9",
                  borderRadius: "14px", padding: "24px", position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" }}>
                        {idx + 1}
                      </div>
                      <strong style={{ fontSize: "15px", color: "#0f0f0f" }}>Episode Details</strong>
                    </div>
                    <button
                      type="button" onClick={() => removeEpisode(idx)}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <input
                        type="text" placeholder="Episode Title" style={inputStyle}
                        value={ep.title} onChange={(e) => updateEpisode(idx, 'title', e.target.value)} required
                        onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                      />
                      <input
                        type="url" placeholder="Video URL (YouTube/Vimeo)" style={inputStyle}
                        value={ep.videoUrl} onChange={(e) => updateEpisode(idx, 'videoUrl', e.target.value)}
                        onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                    <textarea
                      placeholder="Brief description of this episode..." style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                      value={ep.description} onChange={(e) => updateEpisode(idx, 'description', e.target.value)}
                      onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: "40px", border: "2px dashed #e2e8f0",
              borderRadius: "14px", textAlign: "center", color: "#9ca3af"
            }}>
              <p style={{ fontSize: "14px" }}>No episodes added yet. Click "+ Add Episode" to start building your curriculum.</p>
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit" disabled={!token}
            style={btnBlack}
            onMouseEnter={e => e.target.style.background = "#374151"}
            onMouseLeave={e => e.target.style.background = "#0f0f0f"}
          >
            {isEditing ? "Save Changes" : "Create Course"}
          </button>
        </div>

      </form>
    </div>
  );
}
