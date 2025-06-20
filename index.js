 // src/api/index.js
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new students

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetches the list of available courses from the mock API.
 * Demonstrates async/await for network requests.
 * @returns {Promise<Array>} A promise that resolves to an array of course objects.
 */
export const fetchCourses = async () => {
  try {
    // Example of event loop demonstration: A small delay before fetching courses
    // This simulates network latency and allows for other tasks to run in the event loop.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate 0.5 sec network delay

    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const courses = await response.json();
    console.log('Courses fetched:', courses);
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error; // Re-throw to be handled by the calling component
  }
};

/**
 * Fetches all students from the mock API.
 * @returns {Promise<Array>} A promise that resolves to an array of student objects.
 */
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const students = await response.json();
    console.log('Students fetched:', students);
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

/**
 * Adds a new student to the mock API.
 * Assigns a unique ID before sending.
 * @param {Object} studentData - The student object to add (name, email, enrolledCourse, profileImage).
 * @returns {Promise<Object>} A promise that resolves to the newly added student object.
 */
export const addStudent = async (studentData) => {
  try {
    // Hoisting explanation:
    // The 'processStudentData' function is defined below its first call.
    // In JavaScript, function declarations are "hoisted" to the top of their
    // scope, meaning they can be called before they are declared in the code.
    // However, function expressions (e.g., const processStudentData = () => {})
    // are not hoisted in the same way.
    const processedStudentData = processStudentData(studentData);

    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: uuidv4(), ...processedStudentData }), // Assign unique ID
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newStudent = await response.json();
    console.log('Student added:', newStudent);
    return newStudent;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

/**
 * Updates an existing student in the mock API.
 * @param {string} id - The ID of the student to update.
 * @param {Object} updatedData - The updated student data.
 * @returns {Promise<Object>} A promise that resolves to the updated student object.
 */
export const updateStudent = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedStudent = await response.json();
    console.log('Student updated:', updatedStudent);
    return updatedStudent;
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a student from the mock API.
 * @param {string} id - The ID of the student to delete.
 * @returns {Promise<void>} A promise that resolves when the student is deleted.
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(`Student with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Helper function to process student data before sending to API.
 * This is an example to show hoisting.
 * @param {Object} data - Raw student data.
 * @returns {Object} Processed student data.
 */
function processStudentData(data) {
  // Simple example: ensure email is lowercase
  return {
    ...data,
    email: data.email ? data.email.toLowerCase() : '',
  };
}