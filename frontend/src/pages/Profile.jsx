import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo._id) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/auth/profile/${userInfo._id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;

   const getProfileImage = () => {
    if (!userData.photoURL || imageError) {
      const initial = userData.name ? userData.name.charAt(0).toUpperCase() : "U";
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="#667eea"/><text x="75" y="95" font-size="60" text-anchor="middle" fill="white" font-family="Arial">${initial}</text></svg>`;
    }
    if (userData.photo.startsWith("/")) {
      return `http://localhost:5000${userData.photoURL}`;
    }
    return `http://localhost:5000/images/${userData.photoURL}`;
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          {userData.role === 'provider' && userData.category && <p><strong>Category:</strong> {userData.category.name}</p>}
          {userData.role === 'provider' && <p><strong>Bio:</strong> {userData.bio || "N/A"}</p>}
          {userData.role === 'provider' && <p><strong>Skills:</strong> {userData.skills || "N/A"}</p>}
          <p><strong>City:</strong> {userData.city}</p>
          <p><strong>Phone:</strong> {userData.tel}</p>
          {userData.role === 'provider' && <p><strong>Jobs Completed:</strong> {userData.jobsCompleted}</p>}
          {userData.role === 'provider' && <p><strong>Rating:</strong> {userData.Rating}</p>}
          {userData.role === 'provider' && <p><strong>Total Earnings:</strong> {userData.totalEarnings}</p>}
          <p><strong>Blocked:</strong> {userData.isBlocked ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
