import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Service.css";

export const Service = () => {
  const [serviceData, setServiceData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [searchParams] = useSearchParams();
  const [booked, setBooked] = useState({});
  const [message, setMessage] = useState({ text: "", type: "", visible: false });
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

  const showMessage = (text, type = "success") => {
    setMessage({ text, type, visible: true });
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const bookService = async (serviceId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer/book",
        {
          serviceId: serviceId,
          customerId: userInfo._id,
        }
      );
      setBooked((prev) => ({ ...prev, [serviceId]: true }));
      console.log(`Booking service with ID: ${serviceId}`);
      showMessage("Service booked successfully! Check Your Bookings Dashboard", "success");
    } catch (error) {
      console.error("Error booking service:", error);
      showMessage("Failed to book service. Please try again.", "error");
    }
  };

  // Close message when user clicks the close button
  const closeMessage = () => {
    setMessage(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/provider/service"),
          axios.get("http://localhost:5000/api/admin/categories"),
        ]);
        setServiceData(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load services. Please try again later.");
        showMessage("Failed to load services. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) setSelectedCategory(categoryQuery);
  }, [searchParams]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) setSearchTerm(searchQuery);
  }, [searchParams]);

  const handleImageError = (serviceId) => {
    setFailedImages((prev) => new Set(prev).add(serviceId));
  };

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

  const generateFallbackImage = (title) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    ];
    const color = colors[title?.length % colors.length] || colors[0];
    const firstLetter = title ? title.charAt(0).toUpperCase() : "S";
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><defs><linearGradient id="grad"><stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/></linearGradient></defs><rect width="300" height="200" fill="url(#grad)"/><text x="150" y="110" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${firstLetter}</text></svg>`;
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

  const filteredServices = serviceData.filter((service) => {
    const matchesCategory = selectedCategory
      ? service.categoryId === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="service-page">
      {/* Message Notification */}
      {message.visible && (
        <div className={`message-notification ${message.type}`}>
          <div className="message-content">
            <span className="message-text">{message.text}</span>
            <button className="message-close" onClick={closeMessage}>
              ×
            </button>
          </div>
          <div className="message-progress"></div>
        </div>
      )}

      <h1 className="page-title">Our Services</h1>

      <div className="filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service._id} className="service-card">
            <div className="card-image">
              <img
                src={getImageSrc(service)}
                alt={service.title || "Service"}
                onError={() => handleImageError(service._id)}
                loading="lazy"
                onLoad={(e) => {
                  e.target.style.opacity = "1";
                }}
                style={{ opacity: 0, transition: "opacity 0.3s ease" }}
              />
              <div className="image-overlay">
                <button>View Details</button>
              </div>
              {failedImages.has(service._id) && (
                <div className="fallback-image">
                  {service.title ? service.title.charAt(0).toUpperCase() : "S"}
                </div>
              )}
            </div>
            <div className="card-content">
              <h3 className="service-title">
                {service.title || "Untitled Service"}
              </h3>
              <p className="service-description">
                {service.description?.slice(0, 100) || "No description"}
                {service.description?.length > 100 ? "..." : ""}
              </p>
              <div className="service-price">${service.price || "0"}</div>
              {!booked[service._id] ? (
                <button
                  className="book-button"
                  onClick={() => bookService(service._id)}
                >
                  Book Now
                </button>
              ) : (
                <button className="book-button" disabled>
                  Booked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;