import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
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

  const isLoggedIn = !!userInfo;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center text-center text-white bg-dark py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">
                Find Trusted Experts for Any Job on <span className="text-primary">ServiceHub</span>
              </h1>
              <p className="lead mb-4">
                Hire skilled professionals or offer your services — all in one secure platform.
              </p>
              <div className="search-info mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg mb-3"
                  placeholder="Search for services..."
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="image-grid">
                <img src="/images/homeImage1.jpg" alt="Home 1" className="img-fluid rounded grid-image" />
                <img src="/images/homeImage2.jpg" alt="Home 2" className="img-fluid rounded grid-image" />
                <img src="/images/homeImage3.jpg" alt="Home 3" className="img-fluid rounded grid-image" />
                <img src="/images/homeImage4.jpg" alt="Home 4" className="img-fluid rounded grid-image" />
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
                  Every provider is verified to ensure safety and trust in every service booked.
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
                  Book a service in minutes using our simple and intuitive platform.
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
                  Pay confidently through our encrypted and reliable payment system.
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

      {/* Featured Services */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Featured Services</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="bi bi-house-door text-primary fs-1 mb-3"></i>
                  <h5 className="card-title fw-bold">Home Cleaning</h5>
                  <p className="card-text text-muted">Professional cleaning services for your home.</p>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="bi bi-tools text-primary fs-1 mb-3"></i>
                  <h5 className="card-title fw-bold">Plumbing</h5>
                  <p className="card-text text-muted">Expert plumbing repairs and installations.</p>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="bi bi-car-front text-primary fs-1 mb-3"></i>
                  <h5 className="card-title fw-bold">Car Repair</h5>
                  <p className="card-text text-muted">Reliable automotive repair services.</p>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
