import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Navbar from "./components/Navbar";
import Select from 'react-select';

function Profile() {
  const [studentDetails, setStudentDetails] = useState({
    student_number: '',
    first_name: '',
    last_name: '',
    level: '',
    program: '',
    preferred_learning_methods: [],
    preferred_study_times: [],
    preferred_languages: [],
    challenging_subject_areas: [],
    preferred_content_platforms: [],
    topics_of_interest: [],
    future_goals: '',
    challenges: '',
    suggestions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const levels = [1, 2, 3, 4];
  const programs = [
    'B.Sc. (General) Degree',
    'B.Sc. (Joint Major) Degree',
    'B.Sc. (Special) Degree',
    'B.Sc. (Special/Joint Major/General) Degree (For level 1, 2)',
  ];
  const learningMethods = [
    'Videos (YouTube, Tutorials)',
    'Text-Based (Notes, Articles)',
    'Interactive (Quizzes, Tutorials)',
    'Hands-On (Projects, Practical Work)',
  ];
  const studyTimes = ['Morning', 'Afternoon', 'Evening'];
  const languages = ['English', 'Sinhala', 'Tamil'];
  const challengingSubjects = ['Computer Sciences', 'Industrial Management', 'Electronics', 'Mathematics & Statistics'];
  const contentPlatforms = ['YouTube', 'Coursera', 'Khan Academy', 'Udemy', 'Udacity'];
  const topicsOfInterest = [
    'Web Development', 'Machine Learning', 'Supply Chain Management', 'Logistics and Transportation',
    'Digital Electronics', 'Robotics and Automation', 'Statistical Modeling', 'Time Series Analysis',
    'Artificial Intelligence', 'Data Science', 'Cybersecurity'
  ];

  // Fetch user data when the component mounts or when editing starts
  useEffect(() => {
    if (isEditing) {
      fetchUserData();
    }
  }, [isEditing]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-user-data', {
        credentials: 'include', // Include cookies for session-based authentication
      });
      if (response.ok) {
        const data = await response.json();
        setStudentDetails({
          ...data,
          preferred_learning_methods: data.preferred_learning_methods ? data.preferred_learning_methods.split(',') : [],
          preferred_study_times: data.preferred_study_times ? data.preferred_study_times.split(',') : [],
          preferred_languages: data.preferred_languages ? data.preferred_languages.split(',') : [],
          challenging_subject_areas: data.challenging_subject_areas ? data.challenging_subject_areas.split(',') : [],
          preferred_content_platforms: data.preferred_content_platforms ? data.preferred_content_platforms.split(',') : [],
          topics_of_interest: data.topics_of_interest ? data.topics_of_interest.split(',') : [],
        });
      } else {
        setMessage('Failed to fetch user data.');
      }
    } catch (error) {
      setMessage('An error occurred while fetching user data.');
    }
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setStudentDetails(prev => ({ ...prev, [field]: values }));
  };

  const handleSelectChange = (e, field) => {
    setStudentDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChange = (e, field) => {
    setStudentDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting your data...');

    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session-based authentication
        body: JSON.stringify(studentDetails),
      });
      
      if (response.ok) {
        setMessage('Form submitted successfully!');
        setIsEditing(false); // Exit edit mode after saving
      } else {
        setMessage('Error submitting the form.');
      }
    } catch (error) {
      setMessage('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <Navbar />
      <div className="profile-container">
        <div className="profile-left">
          <img
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
            alt="Profile"
            className="profile-photo"
          />
          <div className="basic-details">
            <h2>{studentDetails.first_name} {studentDetails.last_name}</h2>
            <p>Student Number: {studentDetails.student_number}</p>
          </div>
        </div>

        <div className="profile-right">
          <h1 className="profile-title">Update Profile</h1>
          <form className="form-container" onSubmit={handleSubmit}>
            <section className="form-section">
              <h3>Personal Details</h3>
              <input type="text" placeholder="Student Number" value={studentDetails.student_number} onChange={(e) => handleInputChange(e, 'student_number')} required />
              <input type="text" placeholder="First Name" value={studentDetails.first_name} onChange={(e) => handleInputChange(e, 'first_name')} required />
              <input type="text" placeholder="Last Name" value={studentDetails.last_name} onChange={(e) => handleInputChange(e, 'last_name')} required />
            </section>

            <section className="form-section">
              <h3>Academic Details</h3>
              <select value={studentDetails.level} onChange={(e) => handleSelectChange(e, 'level')} required>
                <option value="">Select Level</option>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
              <select value={studentDetails.program} onChange={(e) => handleSelectChange(e, 'program')} required>
                <option value="">Select Program</option>
                {programs.map(program => <option key={program} value={program}>{program}</option>)}
              </select>
            </section>

            <section className="form-section">
              <h3>Preferences</h3>
              <Select isMulti name="preferred_learning_methods" options={learningMethods.map(m => ({ value: m, label: m }))} 
                      value={studentDetails.preferred_learning_methods.map(m => ({ value: m, label: m }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'preferred_learning_methods')} 
                      placeholder="Preferred Learning Methods" required />

              <Select isMulti name="preferred_study_times" options={studyTimes.map(t => ({ value: t, label: t }))} 
                      value={studentDetails.preferred_study_times.map(t => ({ value: t, label: t }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'preferred_study_times')} 
                      placeholder="Preferred Study Times" required />

              <Select isMulti name="preferred_languages" options={languages.map(l => ({ value: l, label: l }))} 
                      value={studentDetails.preferred_languages.map(l => ({ value: l, label: l }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'preferred_languages')} 
                      placeholder="Preferred Languages" required />

              <Select isMulti name="challenging_subject_areas" options={challengingSubjects.map(s => ({ value: s, label: s }))} 
                      value={studentDetails.challenging_subject_areas.map(s => ({ value: s, label: s }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'challenging_subject_areas')} 
                      placeholder="Challenging Subjects" required />

              <Select isMulti name="preferred_content_platforms" options={contentPlatforms.map(c => ({ value: c, label: c }))} 
                      value={studentDetails.preferred_content_platforms.map(c => ({ value: c, label: c }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'preferred_content_platforms')} 
                      placeholder="Preferred Content Platforms" required />

              <Select isMulti name="topics_of_interest" options={topicsOfInterest.map(t => ({ value: t, label: t }))} 
                      value={studentDetails.topics_of_interest.map(t => ({ value: t, label: t }))}
                      onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'topics_of_interest')} 
                      placeholder="Topics of Interest" required />
            </section>

            <section className="form-section">
              <h3>Goals & Feedback</h3>
              <textarea placeholder="Future Goals" value={studentDetails.future_goals} onChange={(e) => handleInputChange(e, 'future_goals')} />
              <textarea placeholder="Challenges" value={studentDetails.challenges} onChange={(e) => handleInputChange(e, 'challenges')} />
              <textarea placeholder="Suggestions" value={studentDetails.suggestions} onChange={(e) => handleInputChange(e, 'suggestions')} />
            </section>

            <div className="button-group">
              <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button type="submit" className="save-button" disabled={isSubmitting || !isEditing}>
                {isSubmitting ? 'Submitting...' : 'Save'}
              </button>
            </div>
          </form>
          {message && <p className="submission-message">{message}</p>}
        </div>
        +
      </div>
    </div>
  );
}

export default Profile;