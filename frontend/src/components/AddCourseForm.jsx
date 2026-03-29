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
      // prepare payload: ensure price is a number and episodes is an array
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

  if (loading) return <div className="text-gray-500">Loading course...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Course" : "Add Course"}</h2>

      {!token && (
        <p className="text-sm text-red-500 mb-4">You must be logged in to {isEditing ? "edit" : "add"} a course.</p>
      )}

      <div className="grid grid-cols-1 gap-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-1 p-2 border rounded"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full mb-1 p-2 border rounded"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Cover Image URL"
          className="w-full mb-1 p-2 border rounded"
          value={course.imageUrl}
          onChange={(e) => setCourse({ ...course, imageUrl: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Price"
            className="w-full mb-1 p-2 border rounded"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: e.target.value })}
            required
          />
          <div className="flex items-center">
            <button type="button" onClick={addEpisode} className="ml-auto bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Add Episode</button>
          </div>
        </div>

        {/* Episodes list */}
        {course.episodes && course.episodes.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Episodes ({course.episodes.length})</h3>
            <div className="space-y-4">
              {course.episodes.map((ep, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Episode {idx + 1}</strong>
                    <button type="button" onClick={() => removeEpisode(idx)} className="text-red-500">Remove</button>
                  </div>
                  <input
                    type="text"
                    placeholder="Episode title"
                    className="w-full mb-1 p-2 border rounded"
                    value={ep.title}
                    onChange={(e) => updateEpisode(idx, 'title', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Episode video URL"
                    className="w-full mb-1 p-2 border rounded"
                    value={ep.videoUrl}
                    onChange={(e) => updateEpisode(idx, 'videoUrl', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Episode image URL"
                    className="w-full mb-1 p-2 border rounded"
                    value={ep.imageUrl}
                    onChange={(e) => updateEpisode(idx, 'imageUrl', e.target.value)}
                  />
                  <textarea
                    placeholder="Episode description"
                    className="w-full mb-1 p-2 border rounded"
                    value={ep.description}
                    onChange={(e) => updateEpisode(idx, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button disabled={!token} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4">
          {isEditing ? "Update Course" : "Add Course"}
        </button>
      </div>
    </form>
  );
}
