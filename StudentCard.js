import React from 'react';
import '../App.css'; // Or a specific CSS file for StudentCard

const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <div className="student-card">
      <img src={student.profileImage || 'https://via.placeholder.com/100'} alt={student.name} className="profile-image" />
      <h3>{student.name}</h3>
      <p>Email: {student.email}</p>
      <p>Course: {student.enrolledCourse}</p>
      <div className="student-actions">
        <button onClick={() => onEdit(student)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(student.id)}>Delete</button>
      </div>
    </div>
  );
};

export default StudentCard;