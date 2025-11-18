import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./ResetPassword.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error sending reset email");
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <Form onSubmit={(e) => { e.preventDefault(); handleReset(); }} className="reset-form">
                    <img src="/service.png" alt="ServiceHub Logo" className="auth-logo" />
                    <h2 className="reset-title">Reset Password</h2>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="reset-input"
                    />

                    {message && <p className="reset-message">{message}</p>}

                    <button type="submit" className="reset-button">Reset Password</button>
                </Form>
            </div>
        </div>
    );
}
export default ResetPassword;