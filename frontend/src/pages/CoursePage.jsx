import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3231/api/courses/${id}`);
        console.log("Course data:", res.data);

        const courseData = res.data.course || res.data; // flexible shape
        setCourse(courseData);
        if (courseData.episodes?.length > 0)
          setSelectedEpisode(courseData.episodes[0]);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading course...
      </div>
    );

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#f1f5f9",
      padding: "40px 60px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", height: "calc(100vh - 80px)" }}>
        {/* Left - Playlist */}
        <div style={{ height: "100%" }}>
          <PlaylistCard
            episodes={course.episodes}
            onSelectEpisode={setSelectedEpisode}
            selectedEpisode={selectedEpisode}
          />
        </div>

        {/* Right - Video Player */}
        <div style={{ height: "100%" }}>
          <VideoCard episode={selectedEpisode} course={course} />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
