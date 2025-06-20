// src/components/StudentForm.js
import React, { useState, useEffect } from 'react';
import '../App.css';
import { fetchCourses } from '../api'; // Fetch courses for the dropdown

const StudentForm = ({ currentStudent, onSave, onCancel, isLoadingCourses }) => {
  const initialFormState = {
    name: '',
    email: '',
    enrolledCourse: '',
    profileImage: 'https://via.placeholder.com/100' // Default image
  };

  // useState to manage form input values
  const [formData, setFormData] = useState(initialFormState);
  // useState to manage validation errors
  const [errors, setErrors] = useState({});
  // useState for courses dropdown
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    // Populate form if we are editing an existing student
    if (currentStudent) {
      setFormData(currentStudent);
    } else {
      // Reset form if no current student (e.g., adding a new one)
      setFormData(initialFormState);
    }
    // Clear errors when currentStudent changes
    setErrors({});
  }, [currentStudent]); // Dependency array: re-run when currentStudent changes

  useEffect(() => {
    // Fetch courses when the component mounts
    const getCourses = async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setCoursesError("Failed to load courses. Please try again.");
        console.error("Error fetching courses in form:", err);
      } finally {
        setCoursesLoading(false);
      }
    };
    getCourses();
  }, []); // Empty dependency array: runs only once on mount

  // Handle input changes for controlled components
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for the field being typed into
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Basic validation function
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.enrolledCourse.trim()) newErrors.enrolledCourse = 'Enrolled Course is required';
    // Optional: Add validation for profileImage URL if needed
    // if (!formData.profileImage.trim()) newErrors.profileImage = 'Profile Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="student-form-container">
      <h2>{currentStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="enrolledCourse">Enrolled Course:</label>
          {coursesLoading ? (
            <p>Loading courses...</p>
          ) : coursesError ? (
            <p className="error-message">{coursesError}</p>
          ) : (
            <select
              id="enrolledCourse"
              name="enrolledCourse"
              value={formData.enrolledCourse}
              onChange={handleChange}
              className={errors.enrolledCourse ? 'input-error' : ''}
            >
              <option value="">-- Select a Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
          )}
          {errors.enrolledCourse && <p className="error-message">{errors.enrolledCourse}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image URL:</label>
          <input
            type="text"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoadingCourses}>Save Student</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;