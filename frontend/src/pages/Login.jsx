import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stale token when opening login page so user always sees clean login form
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://127.0.0.1:8000"
          : "https://student-management-backend-11t2.onrender.com");

      const response = await axios.post(
        `${API_BASE_URL}/api/token/`,
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "username",
        username
      );

      navigate("/dashboard");

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid Credentials");
      } else {
        alert("Unable to reach backend server. Please make sure the backend is running.");
      }
      console.error(error);
    }
  };

 return (
  <div className="login-container">
    <div className="login-box">

      <h1>🎓 Student Management</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>

    </div>
  </div>
);
}

export default Login;