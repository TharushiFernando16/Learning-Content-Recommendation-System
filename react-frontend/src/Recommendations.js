import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Recommendations.css";
import Navbar from "./components/Navbar";

function Recommendations() {
  const [studentNumber, setStudentNumber] = useState("");
  const [recommendations, setRecommendations] = useState({ courses: [], videos: [] });
 

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://localhost:5000/recommendations", {
        method: "POST",
        credentials: "include", // Required for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_number: studentNumber }),
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched recommendations:", data);

        const sanitizedData = {
          courses: data.courses.map(course => ({
              title: course.title || "No Title Available",
              description: course.description && course.description !== "NaN"
                  ? course.description
                  : "No description available",
              link: course.link || "#",
              thumbnail: course.thumbnail || "https://via.placeholder.com/300x180"
          })),
          videos: data.videos.map(video => ({
              title: video.title || "No Title Available",
              description: video.description && video.description !== "NaN"
                  ? video.description
                  : "No description available",
              link: video.link || "#",
              thumbnail: video.thumbnail || "https://via.placeholder.com/300x180"
          })),
      };

        setRecommendations(sanitizedData);
      } else {
        console.error("Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Input Section */}
      
      {/* Recommendations */}
      <div className="recommendations-container">
        <h1 className="recommendations-title">Recommendations</h1>
        <div className="get-recommendations-button">
        
        <button className="get-recommendations-button " onClick={fetchRecommendations}>Get Recommendations</button>
      </div>


        {/* Courses */}
        <h2 className="section-title">Courses</h2>
        <div className="recommendations-row">
          {recommendations.courses.length > 0 ? (
            recommendations.courses.map((item, index) => (
              <div key={index} className="recommendation-card">
                <img
                  src={item.thumbnail}
                  alt="Course Thumbnail"
                  className="recommendation-thumbnail"
                />
                <div className="recommendation-content">
                  <h2 className="recommendation-title">{item.title}</h2>
                  <p className="recommendation-description">{item.description}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recommendation-link"
                  >
                    View Course
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No course recommendations available.</p>
          )}
        </div>

        {/* Videos */}
        <h2 className="section-title">Videos</h2>
        <div className="recommendations-row">
          {recommendations.videos.length > 0 ? (
            recommendations.videos.map((item, index) => (
              <div key={index} className="recommendation-card">
                <img
                  src={item.thumbnail}
                  alt="Video Thumbnail"
                  className="recommendation-thumbnail"
                />
                <div className="recommendation-content">
                  <h2 className="recommendation-title">{item.title}</h2>
                  <p className="recommendation-description">{item.description}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recommendation-link"
                  >
                    View Video
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No video recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
