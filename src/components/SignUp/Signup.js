import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../../stylesheets/SignUp/Signup.css"

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/signup", {
        username,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response.status === 200) {
        setMessage(response.data.message);
        window.location.href = "/login";
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error on signup:", error);
      setMessage("Error on signup");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Welcome</h2>
        <p>Please create your account</p>
        <div className="input-group">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
        <div className="bottom-text">
          <p>
            You already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Signup;
