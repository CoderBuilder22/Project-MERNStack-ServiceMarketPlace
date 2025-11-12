import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    skills: "",
    bio: "",
    photoURL: "",
    city: "",
    tel: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={registerUser} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className="register-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="register-input"
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleChange}
            autoComplete="off"
            className="register-input"
          />
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            autoComplete="off"
            className="register-input"
          />
          <input
            type="text"
            name="photoURL"
            placeholder="Photo URL"
            value={formData.photoURL}
            onChange={handleChange}
            autoComplete="off"
            className="register-input"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            autoComplete="address-level2"
            className="register-input"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="register-input"
          >
            <option value="" disabled hidden>
              Role
            </option>
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="register-input"
          />
          <input
            type="text"
            name="tel"
            placeholder="tel"
            value={formData.tel}
            onChange={handleChange}
            className="register-input"
          />
          <button type="submit" className="register-button">
            Register
          </button>
          <Link to="/login" className="register-link">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
