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
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initials = title ? title.charAt(0).toUpperCase() : 'S';
    
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
    setFailedImages(prev => new Set(prev).add(serviceId));
  };

  // Get category image source
  const getCategoryImageSrc = (categoryId) => {
    if (categoryImages[categoryId]) {
      return categoryImages[categoryId];
    }
    return generateFallbackImage(categories.find(cat => cat._id === categoryId)?.name || 'Category');
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
        
        // Get first 3 categories
        const limitedCategories = categoriesData.slice(0, 3);
        setCategories(limitedCategories);
        
        // Map category images using the same image logic
        const imagesMap = {};
        limitedCategories.forEach(category => {
          const serviceWithImage = servicesData.find(
            service => service.category === category._id
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
      <section className="hero d-flex align-items-center text-center text-white py-5">
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
                  onClick={() =>
                    navigate(isLoggedIn ? "/service" : "/register")
                  }
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

      {/* Why Choose ServiceHub Section */}
      <section className="why-choose-section py-5">
        <div className="container text-center">
          <h2 className="section-title fw-bold mb-5">Why Choose ServiceHub?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h5 className="feature-title fw-bold">Verified Professionals</h5>
                  <p className="feature-description">
                    Every provider is verified to ensure safety and trust in every
                    service booked.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <h5 className="feature-title fw-bold">Fast & Easy Booking</h5>
                  <p className="feature-description">
                    Book a service in minutes using our simple and intuitive
                    platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-lock"></i>
                  </div>
                  <h5 className="feature-title fw-bold">Secure Payments</h5>
                  <p className="feature-description">
                    Pay confidently through our encrypted and reliable payment
                    system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="featured-services-section py-5">
        <div className="container">
          <h2 className="section-title text-center fw-bold mb-5">Featured Services</h2>
          {loading ? (
            <div className="text-center">
              <p className="text-white">Loading featured services...</p>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="row g-4">
              {featuredServices.map((service) => (
                <div key={service._id} className="col-lg-4 col-md-6">
                  <div className="service-card card border-0 shadow-sm h-100">
                    <div className="service-image-container">
                      <img
                        src={getImageSrc(service)}
                        alt={service.title || "Service"}
                        onError={() => handleImageError(service._id)}
                        loading="lazy"
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                        className="service-image card-img-top"
                      />
                    </div>
                    <div className="card-body p-4">
                      <h5 className="service-title card-title fw-bold">{service.title}</h5>
                      <p className="service-description card-text">
                        {service.description && service.description.length > 120 
                          ? `${service.description.substring(0, 120)}...` 
                          : service.description || "No description available."}
                      </p>
                      <div className="service-meta d-flex justify-content-between align-items-center">
                        <span className="service-price fw-bold text-primary">
                          ${service.price || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white">No featured services available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section py-5">
        <div className="container text-center">
          <h2 className="section-title fw-bold mb-5">ServiceHub in Numbers</h2>
          <div className="row g-4">
            {/* Card 1 - Total Users */}
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-icon mb-3">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="display-5 fw-bold">{totalUsers}</h3>
                <p className="mb-0">Total Users</p>
              </div>
            </div>

            {/* Card 2 - Services Offered */}
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-icon mb-3">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <h3 className="display-5 fw-bold">{totalServices}</h3>
                <p className="mb-0">Services Offered</p>
              </div>
            </div>

            {/* Card 3 - Categories */}
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-icon mb-3">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                  </svg>
                </div>
                <h3 className="display-5 fw-bold">{totalCategories}</h3>
                <p className="mb-0">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <div className="container text-center">
          <h2 className="section-title fw-bold mb-4">Browse Categories</h2>
          {loading ? (
            <p className="text-white">Loading categories...</p>
          ) : categories.length > 0 ? (
            <>
              <div className="row g-4 justify-content-center mb-4">
                {categories.map((category) => (
                  <div key={category._id} className="col-lg-4 col-md-6">
                    <div 
                      className="category-card card border-0 shadow-sm h-100"
                      onClick={() => navigate(`/service?category=${category._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="category-image-container">
                        <img
                          src={getCategoryImageSrc(category._id)}
                          alt={category.name}
                          className="category-image card-img-top"
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="category-name card-title fw-bold">{category.name}</h5>
                        <button className="btn btn-outline-primary btn-sm">
                          Explore Services
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-white">No categories available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;