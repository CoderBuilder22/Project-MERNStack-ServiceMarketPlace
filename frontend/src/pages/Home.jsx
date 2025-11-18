import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("userInfo");
      }
    }
    return null;
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!userInfo;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/categories"
        );
        setCategories(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center text-center text-white bg-dark py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">
                Find Trusted Experts for Any Job on <span>ServiceHub</span>
              </h1>
              <p className="lead mb-4">
                Hire skilled professionals or offer your services — all in one
                secure platform.
              </p>
              <div className="search-info mb-4">
                <button
                  className="btn btn-primary btn-lg me-3"
                  onClick={() => navigate(isLoggedIn ? "/service" : "/register")}
                >
                  {isLoggedIn ? "Explore Services" : "Get Started"}
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="image-grid">
                <img
                  src="/images/homeImage1.jpg"
                  alt="Home 1"
                  className="img-fluid rounded grid-image"
                />
                <img
                  src="/images/homeImage2.jpg"
                  alt="Home 2"
                  className="img-fluid rounded grid-image"
                />
                <img
                  src="/images/homeImage3.jpg"
                  alt="Home 3"
                  className="img-fluid rounded grid-image"
                />
                <img
                  src="/images/homeImage4.jpg"
                  alt="Home 4"
                  className="img-fluid rounded grid-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Choose ServiceHub?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <div className="mb-3">
                  <i className="bi bi-shield-check text-primary fs-1"></i>
                </div>
                <h5 className="fw-bold">Verified Professionals</h5>
                <p className="text-muted">
                  Every provider is verified to ensure safety and trust in every
                  service booked.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <div className="mb-3">
                  <i className="bi bi-lightning-charge text-primary fs-1"></i>
                </div>
                <h5 className="fw-bold">Fast & Easy Booking</h5>
                <p className="text-muted">
                  Book a service in minutes using our simple and intuitive
                  platform.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <div className="mb-3">
                  <i className="bi bi-lock text-primary fs-1"></i>
                </div>
                <h5 className="fw-bold">Secure Payments</h5>
                <p className="text-muted">
                  Pay confidently through our encrypted and reliable payment
                  system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">ServiceHub in Numbers</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stat-card">
                <h3 className="display-5 fw-bold">10,000+</h3>
                <p className="mb-0">Total Users</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3 className="display-5 fw-bold">5,000+</h3>
                <p className="mb-0">Services Offered</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3 className="display-5 fw-bold">50,000+</h3>
                <p className="mb-0">Bookings Completed</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h3 className="display-5 fw-bold">4.8/5</h3>
                <p className="mb-0">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">All Services</h2>
          {loading ? (
            <p>Loading services...</p>
          ) : (
            <>
              <div className="d-flex justify-content-center gap-3 mb-4">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/service?category=${category._id}`)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
