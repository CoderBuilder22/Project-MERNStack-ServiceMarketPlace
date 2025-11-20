import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log(response.data);
      setMessage("Login successful! Redirecting...");
      setMessageType("success");
      
      if (response.data) {
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        window.dispatchEvent(new Event("storage"));
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Login failed", error);
      setMessage("Login failed. Please check your credentials.");
      setMessageType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/service.png" alt="ServiceHub Logo" className="auth-logo" />
        <h2 className="login-title">Login</h2>
        
        {/* Message Display - Fixed className */}
        {message && (
          <div className={`auth-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <form className="login-form" onSubmit={loginUser}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="login-input"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="login-input"
          />
          
          <button type="submit" className="login-button">Login</button>
          
          <Link to="/register" className="login-link">
            Don't have an account? Register
          </Link>
          
          <Link to="/reset-password" className="login-link">
            Forget password? Reset here
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;