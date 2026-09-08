import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { FaUserGraduate, FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const [darkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    phone: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/students/")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
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
      alert("Please fill all fields");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/students/update/${editingId}/`,
          formData
        );

        setMessage("Student Updated Successfully!");
        setEditingId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/students/",
          formData
        );

        setMessage("Student Added Successfully!");
      }

      setFormData({
        name: "",
        email: "",
        course: "",
        phone: "",
      });

      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/students/${id}/`
      );

      setMessage("Student Deleted Successfully!");

      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error(error);
    }
  };

    const filteredStudents = students
    .filter((student) =>
      student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
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
  );

  return (
    <>
      <div className="navbar">
        🎓 Student Management System
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
      </div>

      <div className={darkMode ? "container dark" : "container"}>

        {message && (
          <div className="message">
            {message}
      </div>
        )}

       <div className="dashboard">

            <div className="card">
              <FaUserGraduate size={30} />
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>

            <div className="card">
              <h3>Courses</h3>
              <p>
                {
                  [...new Set(
                    students.map(student => student.course)
                  )].length
                }
              </p>
            </div>

            <div className="card">
              <h3>Search Results</h3>
              <p>
                {
                  students.filter(student =>
                    student.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ).length
                }
              </p>
            </div>

          </div>

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

          {loading && <h3>Loading Students...</h3>}

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
            </tbody>

          </table>

        </div>
      </div>
    </>
  );
}

export default App;