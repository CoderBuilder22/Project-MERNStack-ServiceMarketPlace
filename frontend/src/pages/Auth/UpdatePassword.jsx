import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!password) {
      setMessage("Please enter a new password");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/update-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setMessage("Password updated successfully! Redirecting to login...");
        setMessageType("success");
        
        // Navigate to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to update password");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An error occurred while updating password");
      setMessageType("error");
    }
  };

  return (
    <div className="update-container">
      <div className="update-card">
        <Form onSubmit={handleSubmit} className="update-form">
          <img src="/service.png" alt="ServiceHub Logo" className="auth-logo" />
          <h2 className="update-title">Update Password</h2>
          
          {/* Message Display */}
          {message && (
            <div className={`auth-message ${messageType}`}>
              {message}
            </div>
          )}
          
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="update-input"
            required
          />
          <button type="submit" className="update-button">
            Update Password
          </button>
        </Form>
      </div>
    </div>
  );
};

export default UpdatePassword;