import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [tel, setTel] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo._id) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/auth/profile/${userInfo._id}`
        );
        setUserData(response.data);

        // Initialize form fields
        setName(response.data.name || "");
        setEmail(response.data.email || "");
        setCity(response.data.city || "");
        setTel(response.data.tel || "");
        setBio(response.data.bio || "");
        setSkills(response.data.skills || "");
        setPhotoURL(response.data.photoURL || "");

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo._id) {
        setUpdateError("User not logged in");
        setUpdateLoading(false);
        return;
      }
      const updatePayload = {
        name,
        email,
        city,
        tel,
        bio,
        skills,
        photoURL,
      };

      const response = await axios.patch(
        `http://localhost:5000/api/customer/profile/${userInfo._id}`,
        updatePayload
      );

      setUserData(response.data.user);
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              City:
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <label>
              Phone:
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            </label>
          </div>

          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </label>

          <label>
            Skills:
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List your skills separated by commas..."
            />
          </label>

          <label>
            Photo URL:
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </label>

          <button type="submit" disabled={updateLoading}>
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>

          {updateError && <p className="profile-error">{updateError}</p>}
          {updateSuccess && (
            <p className="profile-success">Profile updated successfully!</p>
          )}
        </form>
      </div>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> {userData.role}
        </p>
        {userData.role === "provider" && userData.category && (
          <p>
            <strong>Category:</strong> {userData.category.name}
          </p>
        )}
        {userData.role === "provider" && (
          <p>
            <strong>Bio:</strong> {userData.bio || "N/A"}
          </p>
        )}
        {userData.role === "provider" && (
          <p>
            <strong>Skills:</strong> {userData.skills || "N/A"}
          </p>
        )}
        <p>
          <strong>City:</strong> {userData.city}
        </p>
        <p>
          <strong>Phone:</strong> {userData.tel}
        </p>
        {userData.role === "provider" && (
          <p>
            <strong>Jobs Completed:</strong> {userData.jobsCompleted}
          </p>
        )}
        {userData.role === "provider" && (
          <p>
            <strong>Rating:</strong> {userData.Rating}
          </p>
        )}
        {userData.role === "provider" && (
          <p>
            <strong>Total Earnings:</strong> {userData.totalEarnings}
          </p>
        )}
        <p>
          <strong>Blocked:</strong> {userData.isBlocked ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
