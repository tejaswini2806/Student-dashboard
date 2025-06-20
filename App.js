import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from './api';
import './App.css'; // Main application styles

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null); // Student being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Controls form visibility
  const [formSubmitLoading, setFormSubmitLoading] = useState(false); // For form submission state

  // useCallback for stable functions passed to child components to prevent unnecessary re-renders
  // This is an optimization technique.
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch students. Please try again.");
      console.error("Error in loadStudents:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array: function reference won't change

  // useEffect to fetch students when the component mounts
  useEffect(() => {
    loadStudents();
  }, [loadStudents]); // Dependency array ensures it runs when loadStudents is stable (thanks to useCallback)

  const handleAddClick = () => {
    setEditingStudent(null); // Clear any student being edited
    setIsFormVisible(true);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsFormVisible(true);
  };

  const handleFormSave = async (studentData) => {
    setFormSubmitLoading(true);
    setError(null); // Clear previous errors
    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(studentData.id, studentData);
      } else {
        // Add new student
        await addStudent(studentData);
      }
      setIsFormVisible(false); // Hide form after save
      setEditingStudent(null); // Reset editing state
      loadStudents(); // Re-fetch students to update the list
    } catch (err) {
      setError(`Failed to ${editingStudent ? 'update' : 'add'} student: ${err.message}`);
      console.error("Error saving student:", err);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true); // Indicate loading while deleting
      setError(null);
      try {
        await deleteStudent(id);
        loadStudents(); // Re-fetch students to update the list
      } catch (err) {
        setError(`Failed to delete student: ${err.message}`);
        console.error("Error deleting student:", err);
      } finally {
        setLoading(false); // End loading state
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingStudent(null);
    setError(null); // Clear any form-related errors on cancel
  };

  // useMemo for optimization: only re-calculate filtered students if `students` array changes.
  // This prevents unnecessary re-renders of the list if other unrelated state changes.
  const totalStudentsCount = useMemo(() => {
    console.log('Calculating total student count...'); // Demonstrate useMemo re-calculation
    return students.length;
  }, [students]); // Dependency array: only re-run if 'students' changes

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Management Dashboard</h1>
        <p>Total Students: {totalStudentsCount}</p>
        <button onClick={handleAddClick} className="add-student-button">
          {editingStudent ? 'Cancel Edit' : 'Add New Student'}
        </button>
      </header>

      <main className="App-main">
        {error && <p className="app-error-message">{error}</p>}

        {isFormVisible ? (
          <StudentForm
            currentStudent={editingStudent}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            isLoadingCourses={formSubmitLoading} // Pass loading state to form for disabling
          />
        ) : (
          <StudentList
            students={students}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isLoading={loading}
            error={error}
          />
        )}
      </main>
    </div>
  );
}

export default App;