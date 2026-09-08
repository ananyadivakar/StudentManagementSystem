import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
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

      alert("Login Successful");

      window.location.href = "/dashboard";

    } catch (error) {
      alert("Invalid Credentials");
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