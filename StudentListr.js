import React from 'react';
import StudentCard from './StudentCard';
import LoadingSpinner from './LoadingSpinner'; // Import the spinner
import '../App.css';

const StudentList = ({ students, onEdit, onDelete, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="error-message">Error loading students: {error}</p>;
  }

  if (students.length === 0) {
    return <p className="no-students-message">No students added yet. Add a new student!</p>;
  }

  return (
    <div className="student-list-container">
      <h2>Our Students</h2>
      <div className="student-cards-grid">
        {students.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentList;