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
  const [services, setServices] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryImages, setCategoryImages] = useState({});
  const [failedImages, setFailedImages] = useState(new Set());

  const isLoggedIn = !!userInfo;

  // Generate fallback image with service title
  const generateFallbackImage = (title) => {
    const colors = [
      "#007bff",
      "#28a745",
      "#dc3545",
      "#ffc107",
      "#17a2b8",
      "#6f42c1",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initials = title ? title.charAt(0).toUpperCase() : "S";

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${color}" opacity="0.8"/><text x="100" y="110" font-family="Arial, sans-serif" font-size="80" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  };

  // Get image source with fallback logic
  const getImageSrc = (service) => {
    if (
      failedImages.has(service._id) ||
      !service.photoURL ||
      service.photoURL.trim() === "" ||
      service.photoURL === "undefined" ||
      service.photoURL === "null"
    ) {
      return generateFallbackImage(service.title);
    }
    if (service.photoURL.startsWith("/")) {
      return `http://localhost:5000${service.photoURL}`;
    }
    return service.photoURL;
  };

  // Handle image error
  const handleImageError = (serviceId) => {
    setFailedImages((prev) => new Set(prev).add(serviceId));
  };

  // Get category image source
  const getCategoryImageSrc = (categoryId) => {
    if (categoryImages[categoryId]) {
      return categoryImages[categoryId];
    }
    return generateFallbackImage(
      categories.find((cat) => cat._id === categoryId)?.name || "Category"
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/services"),
          axios.get("http://localhost:5000/api/admin/categories"),
          axios.get("http://localhost:5000/api/admin/users"),
        ]);

        const servicesData = servicesRes.data;
        const categoriesData = categoriesRes.data;

        setServices(servicesData);
        setTotalServices(servicesData.length);
        setTotalCategories(categoriesData.length);
        setTotalUsers(usersRes.data.length);

        const limitedCategories = categoriesData.slice(0, 3);
        setCategories(limitedCategories);

        const imagesMap = {};
        limitedCategories.forEach((category) => {
          const serviceWithImage = servicesData.find(
            (service) => service.category === category._id
          );
          if (serviceWithImage) {
            imagesMap[category._id] = getImageSrc(serviceWithImage);
          } else {
            imagesMap[category._id] = generateFallbackImage(category.name);
          }
        });
        setCategoryImages(imagesMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get featured services (first 3 services)
  const featuredServices = services.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center text-white position-relative overflow-hidden">
        <div className="container position-relative z-2">
          <div className="row align-items-center min-vh-80 py-5">
            <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4 hero-title">
                  Find Trusted Experts for Any Job on{" "}
                  <span className="text-primary">ServiceHub</span>
                </h1>
                <p className="lead mb-4 fs-5 hero-subtitle">
                  Hire skilled professionals or offer your services — all in one
                  secure platform. Connect with verified experts and get your
                  tasks done efficiently.
                </p>
                <div className="hero-actions d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-primary btn-lg px-4 py-3 fw-semibold rounded-pill shadow-lg"
                    onClick={() =>
                      navigate(isLoggedIn ? "/service" : "/register")
                    }
                  >
                    {isLoggedIn ? "Explore Services" : "Get Started"}
                    <span className="ms-2">→</span>
                  </button>
                </div>
                <div className="hero-stats d-flex flex-wrap gap-4 mt-5 pt-3">
                  <div className="stat-item">
                    <h4 className="fw-bold mb-1">{totalUsers}+</h4>
                    <small className="text-light opacity-75">Happy Users</small>
                  </div>
                  <div className="stat-item">
                    <h4 className="fw-bold mb-1">{totalServices}+</h4>
                    <small className="text-light opacity-75">Services</small>
                  </div>
                  <div className="stat-item">
                    <h4 className="fw-bold mb-1">{totalCategories}+</h4>
                    <small className="text-light opacity-75">Categories</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="hero-visual position-relative">
                <div className="image-grid">
                  <div className="grid-item main-item">
                    <img
                      src="/images/homeImage1.jpg"
                      alt="Professional Service"
                      className="img-fluid rounded-4 shadow-lg"
                    />
                  </div>
                  <div className="grid-item side-item top">
                    <img
                      src="/images/homeImage2.jpg"
                      alt="Home Services"
                      className="img-fluid rounded-3 shadow"
                    />
                  </div>
                  <div className="grid-item side-item bottom">
                    <img
                      src="/images/homeImage3.jpg"
                      alt="Quality Work"
                      className="img-fluid rounded-3 shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ServiceHub Section */}
      <section className="why-choose-section py-5 position-relative">
        <div className="container position-relative z-2">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold display-5 mb-3">
              Why Choose ServiceHub?
            </h2>
            <p
              className="section-subtitle lead text-light opacity-75 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              We provide the best platform to connect customers with trusted
              service providers
            </p>
          </div>
          <div className="row g-4">
            <div className="col-xl-4 col-md-6">
              <div className="feature-card card border-0 shadow-lg h-100 hover-lift">
                <div className="card-body text-center p-4 p-xl-5">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-primary bg-opacity-10 rounded-3">
                      <span className="fs-1">🛡️</span>
                    </div>
                  </div>
                  <h5 className="feature-title fw-bold fs-4 mb-3">
                    Verified Professionals
                  </h5>
                  <p className="feature-description text-muted fs-6 lh-lg mb-0">
                    Every service provider is thoroughly verified to ensure
                    safety, reliability, and trust in every service booked
                    through our platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="feature-card card border-0 shadow-lg h-100 hover-lift">
                <div className="card-body text-center p-4 p-xl-5">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-success bg-opacity-10 rounded-3">
                      <span className="fs-1">⚡</span>
                    </div>
                  </div>
                  <h5 className="feature-title fw-bold fs-4 mb-3">
                    Fast & Easy Booking
                  </h5>
                  <p className="feature-description text-muted fs-6 lh-lg mb-0">
                    Book services in minutes with our intuitive platform. Simple
                    search, instant booking, and quick confirmation make
                    scheduling effortless.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="feature-card card border-0 shadow-lg h-100 hover-lift">
                <div className="card-body text-center p-4 p-xl-5">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-primary bg-opacity-10 rounded-3">
                      <span className="fs-1">⭐</span>
                    </div>
                  </div>
                  <h5 className="feature-title fw-bold fs-4 mb-3">
                    Reviews & Ratings
                  </h5>
                  <p className="feature-description text-muted fs-6 lh-lg mb-0">
                    Make informed decisions by reading real client reviews and
                    ratings for every professional before booking a service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="featured-services-section py-5 position-relative">
        <div className="container position-relative z-2">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold display-5 mb-3">
              Featured Services
            </h2>
            <p
              className="section-subtitle lead text-light opacity-75 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Discover our most popular and highly-rated services
            </p>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="text-light fs-5">Loading featured services...</p>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="row g-4">
              {featuredServices.map((service) => (
                <div key={service._id} className="col-xl-4 col-lg-6">
                  <div className="service-card card border-0 shadow-lg h-100 hover-lift">
                    <div className="service-image-container position-relative overflow-hidden">
                      <img
                        src={getImageSrc(service)}
                        alt={service.title || "Service"}
                        onError={() => handleImageError(service._id)}
                        loading="lazy"
                        className="service-image card-img-top"
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <div className="service-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <button
                          className="btn btn-primary rounded-pill px-4"
                          onClick={() =>
                            navigate(isLoggedIn ? "/service" : "/login")
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-4 text-white">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="service-title card-title fw-bold fs-5 mb-0 flex-grow-1 me-3">
                          {service.title}
                        </h5>
                        <span className="service-price">
                          ${service.price || "N/A"}
                        </span>
                      </div>
                      <p className="service-description card-text lh-base mb-4">
                        {service.description && service.description.length > 120
                          ? `${service.description.substring(0, 120)}...`
                          : service.description || "No description available."}
                      </p>
                      <div className="service-meta d-flex justify-content-end align-items-center">
                        <button
                          className="btn btn-outline-light btn-sm rounded-pill"
                          onClick={() =>
                            navigate(isLoggedIn ? "/service" : "/login")
                          }
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="empty-state-icon mb-4">
                <span className="fs-1">📦</span>
              </div>
              <h4 className="text-light mb-3">
                No Featured Services Available
              </h4>
              <p className="text-light opacity-75 mb-4">
                Check back later for new services
              </p>
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => navigate("/service")}
              >
                Browse All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section py-5 position-relative">
        <div className="container position-relative z-2">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold display-5 mb-3">
              ServiceHub in Numbers
            </h2>
            <p
              className="section-subtitle lead text-light opacity-75 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Join thousands of satisfied users and service providers
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="stat-card text-center p-4 p-xl-5 hover-scale">
                <div className="stat-icon-wrapper mb-4">
                  <div className="stat-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center">
                    <span className="fs-1">👥</span>
                  </div>
                </div>
                <h3 className="display-4 fw-bold text-white mb-2">
                  {totalUsers}
                </h3>
                <p className="stat-label text-light opacity-75 fs-5 mb-0">
                  Total Users
                </p>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="stat-card text-center p-4 p-xl-5 hover-scale">
                <div className="stat-icon-wrapper mb-4">
                  <div className="stat-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center">
                    <span className="fs-1">💼</span>
                  </div>
                </div>
                <h3 className="display-4 fw-bold text-white mb-2">
                  {totalServices}
                </h3>
                <p className="stat-label text-light opacity-75 fs-5 mb-0">
                  Services Offered
                </p>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="stat-card text-center p-4 p-xl-5 hover-scale">
                <div className="stat-icon-wrapper mb-4">
                  <div className="stat-icon bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center">
                    <span className="fs-1">📁</span>
                  </div>
                </div>
                <h3 className="display-4 fw-bold text-white mb-2">
                  {totalCategories}
                </h3>
                <p className="stat-label text-light opacity-75 fs-5 mb-0">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5 position-relative">
        <div className="container position-relative z-2">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold display-5 mb-3">
              Browse Categories
            </h2>
            <p
              className="section-subtitle lead text-light opacity-75 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Explore services by category and find exactly what you need
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="text-light fs-5">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="row g-4 justify-content-center">
              {(() => {
                const images = [
                  "/images/homeImage1.jpg",
                  "/images/homeImage2.jpg",
                  "/images/homeImage3.jpg",
                ];

                return categories.map((category, index) => (
                  <div key={category._id} className="col-lg-4 col-md-6">
                    <div
                      className="category-card card border-0 shadow-lg h-100 hover-lift position-relative overflow-hidden"
                      onClick={() =>
                        navigate(`/service?category=${category._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="category-image-container position-relative">
                        <img
                          src={images[index % images.length]}
                          alt={category.name}
                          className="category-image card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>

                      <div className="card-body text-center p-4">
                        <h5 className="category-name card-title fw-bold fs-4 mb-3">
                          {category.name}
                        </h5>
                        <p className="category-description text-muted mb-4">
                          Discover top-rated {category.name.toLowerCase()}{" "}
                          services from verified professionals
                        </p>
                        <button className="btn btn-outline-primary rounded-pill px-4">
                          View Services →
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="empty-state-icon mb-4">
                <span className="fs-1">📂</span>
              </div>
              <h4 className="text-light mb-3">No Categories Available</h4>
              <p className="text-light opacity-75">
                Categories will be available soon
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
