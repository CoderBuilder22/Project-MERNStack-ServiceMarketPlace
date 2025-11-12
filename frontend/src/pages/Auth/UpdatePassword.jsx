import { useState } from "react";
import { Form } from "react-bootstrap";
import { useParams , useNavigate } from "react-router-dom";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const res = await fetch(`http://localhost:5000/api/auth/update-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        navigate("/login");
      } else {
        alert("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="update-container">
      <div className="update-card">
        <Form onSubmit={handleSubmit} className="update-form">
          <h2 className="update-title">Update Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="update-input"
          />
          <button type="submit" className="update-button">Update Password</button>
        </Form>
      </div>
    </div>
  );
};
export default UpdatePassword;
