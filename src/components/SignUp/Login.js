import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../../stylesheets/SignUp/Login.css"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/login", {
        username,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response.status === 200) {
        setMessage(response.data.message);
        const token = localStorage.setItem("token", response.data.token)
        window.location.href = "/todos";
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error on signup:", error);
      setMessage("Error on signup");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Please login to your account</p>
        <div className="input-group">
          <input
            className="name-input"
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            className="password-input"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <div className="bottom-text">
          <p>
            Don't have an account? <Link to="/">Signup</Link>
          </p>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Login;
