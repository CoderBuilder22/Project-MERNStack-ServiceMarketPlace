import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    category: "",
    skills: "",
    bio: "",
    photo: null,
    city: "",
    tel: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [fileName, setFileName] = useState("No file chosen");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setFileName(file ? file.name : "No file chosen");
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Role is required";
    else if (formData.role !== "customer" && formData.role !== "provider")
      newErrors.role = "Role must be 'customer' or 'provider'";
    if (formData.role === "provider" && !formData.category.trim()) newErrors.category = "Category is required for providers";
    if (formData.role === "provider" && !formData.skills.trim()) newErrors.skills = "Skills are required for providers";
    if (formData.role === "provider" && !formData.bio.trim()) newErrors.bio = "Bio is required for providers";
    if (!formData.tel.trim()) newErrors.tel = "Phone is required";
    else if (!/^\d{8}$/.test(formData.tel))
      newErrors.tel = "Phone must be exactly 8 digits";
    if (!formData.city.trim()) newErrors.city = "City is required";
    return newErrors;
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      setMessage("Registered successfully! Redirecting to login...");
      setMessageType("success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed", error);
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src="/service.png" alt="ServiceHub Logo" className="auth-logo" />
        <h2 className="register-title">Register</h2>
        
        {/* Message Display - Fixed className */}
        {message && (
          <div className={`auth-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={registerUser} className="register-form">
          {/* ... rest of your form fields remain the same ... */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              className="register-input"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="register-input"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="skills"
              placeholder="Skills"
              value={formData.skills}
              onChange={handleChange}
              autoComplete="off"
              className="register-input"
            />
            {errors.skills && <p className="error-message">{errors.skills}</p>}
          </div>
          <div>
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              autoComplete="off"
              className="register-input"
            />
            {errors.bio && <p className="error-message">{errors.bio}</p>}
          </div>
          <div className="file-input-container">
            <label htmlFor="photo" className="file-label">
              Choose File
            </label>
            <span className="file-name">{fileName}</span>
            <input
              id="photo"
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="register-input"
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              autoComplete="address-level2"
              className="register-input"
            />
            {errors.city && <p className="error-message">{errors.city}</p>}
          </div>
          <div className="role-input-container">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-role"
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="customer">Customer</option>
              <option value="provider">Provider</option>
            </select>
            {errors.role && <p className="error-message">{errors.role}</p>}
          </div>
          {formData.role === "provider" && (
            <div className="category-input-container">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select-category"
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="error-message">{errors.category}</p>}
            </div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="register-input"
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <div>
            <input
              type="text"
              name="tel"
              placeholder="tel"
              value={formData.tel}
              onChange={handleChange}
              className="register-input"
            />
            {errors.tel && <p className="error-message">{errors.tel}</p>}
          </div>
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