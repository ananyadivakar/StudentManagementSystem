import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StudentChart from "../components/StudentChart";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const getAuthConfig = () => {
  const token = localStorage.getItem("access_token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

function StudentDashboard()  {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    phone: "",
  });

  useEffect(() => {
  fetchStudents();
}, []);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const fetchStudents = () => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/api/students/`, getAuthConfig())
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to load students");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      phone: student.phone,
    });

    setEditingId(student.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.course ||
      !formData.phone
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must contain only digits");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/students/update/${editingId}/`,
          formData,
          getAuthConfig()
        );

        toast.success("Student Updated Successfully!");
        setEditingId(null);
      } else {
        await axios.post(
          `${API_BASE_URL}/api/students/`,
          formData,
          getAuthConfig()
        );

        toast.success("Student Added Successfully!");
      }

      setFormData({
        name: "",
        email: "",
        course: "",
        phone: "",
      });

      fetchStudents();

    } catch (error) {
      console.error(error);
      toast.error("Unable to save student");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/students/${id}/`,
        getAuthConfig()
      );

      toast.success("Student Deleted Successfully!");

      fetchStudents();

    } catch (error) {
      console.error(error);
      toast.error("Unable to delete student");
    }
  };

  const filteredStudents = students
  .filter(
    (student) =>
      String(student.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(student.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(student.course || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(student.id || "").includes(searchTerm)
  )
  .sort((a, b) =>
    sortOrder === "asc"
      ? String(a.name || "").localeCompare(String(b.name || ""))
      : String(b.name || "").localeCompare(String(a.name || ""))
  );
  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent - studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );

  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  ) || 1;
const courseCount = {};

students.forEach((student) => {
  courseCount[student.course] =
    (courseCount[student.course] || 0) + 1;
});


  const handleLogout = () => {
  if (window.confirm("Logout from dashboard?")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.href = "/";
  }
};
const exportCSV = () => {
  const headers = "ID,Name,Email,Course,Phone\n";

  const rows = students
    .map(
      (s) =>
        `${s.id},${s.name},${s.email},${s.course},${s.phone}`
    )
    .join("\n");

  const blob = new Blob(
    [headers + rows],
    { type: "text/csv;charset=utf-8;" }
  );

  saveAs(blob, "students.csv");
};
const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Student Management Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["ID", "Name", "Email", "Course", "Phone"]],
    body: students.map((s) => [
      s.id,
      s.name,
      s.email,
      s.course,
      s.phone,
    ]),
  });

  doc.save("students.pdf");
};
const totalCourses =
  [...new Set(students.map(s => s.course))].length;

const averageStudents =
  totalCourses > 0
    ? (students.length / totalCourses).toFixed(1)
    : 0;
  return (
    <>
    <div className="navbar">
        <h2>🎓 Student Management System</h2>

        <div className="nav-right">
            <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
            </button>

            <button onClick={handleLogout}>
            Logout
            </button>
        </div>
        </div>
        <div className={darkMode ? "container dark" : "container"}>
        <div className="welcome-card">
            <h2>Welcome, {username || "Student"}!</h2>
            <p>
              Manage students, track courses, and analyze data from one dashboard.
            </p>
        </div>
        
        <div className="dashboard">

            <div className="card">
                <h3>Total Students</h3>
                <p>{students.length}</p>
            </div>

            <div className="card">
                <h3>Total Courses</h3>
                <p>
                {
                    [...new Set(
                    students.map(s => s.course)
                    )].length
                }
                </p>
            </div>

            <div className="card">
                <h3>Search Results</h3>
                <p>{filteredStudents.length}</p>
            </div>
          </div>

        {<StudentChart students={students} />}
        <div className="form-card">
          <h2>
            {editingId ? "Edit Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="course"
                placeholder="Enter Course"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button className="btn" type="submit">
              {editingId ? "Update Student" : "Add Student"}
            </button>

          </form>
        </div>

        <div className="table-card">

          <h2>Student List</h2>

          <input
            className="search-box"
            type="text"
            placeholder="Search Student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <br /><br />

          <button
            className="btn"
            onClick={() =>
              setSortOrder(
                sortOrder === "asc" ? "desc" : "asc"
              )
            }
          >
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>

          <br /><br />

          {loading && <div className="loader"></div>}
          {currentStudents.length === 0 && (
            <h3>No Students Found 🔍</h3>
          )}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.phone}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(student)}
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                  </td>
                </tr>
              ))}
              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="6">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
           </table>

            <div className="table-header">
              <div className="export-buttons">
                <button
                  className="export-btn"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>

                <button
                  className="export-btn"
                  onClick={exportPDF}
                >
                  Export PDF
                </button>
              </div>
            </div>
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>
            
            <footer className="footer">
                Developed by Ananya D❤️ | React + Django REST Framework
            </footer>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
