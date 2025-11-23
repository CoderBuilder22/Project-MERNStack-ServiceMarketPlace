import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceProviderDashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providerCategory, setProviderCategory] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
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

  const [profileData, setProfileData] = React.useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return;
      try {
        const [
          servicesRes,
          categoriesRes,
          profileRes,
          bookingsRes,
          reviewsRes,
        ] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/provider/services/provider/${userInfo._id}`
          ),
          axios.get("http://localhost:5000/api/admin/categories"),
          axios.get(`http://localhost:5000/api/auth/profile/${userInfo._id}`),
          axios
            .get(
              `http://localhost:5000/api/provider/bookings/provider/${userInfo._id}`
            )
            .catch(() => ({ data: [] })),

          axios.get(
            `http://localhost:5000/api/provider/reviews/${userInfo._id}`
          ),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
        setProviderCategory(profileRes.data.category);
        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo]);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (!userInfo || !userInfo._id) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/profile/${userInfo._id}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [userInfo]);

  // Fix: Improved form data handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("providerId", userInfo._id);

      if (photo) {
        formDataToSend.append("photo", photo);
      }

      const response = await axios.post(
        "http://localhost:5000/api/provider/service",
        formDataToSend
      );
      setServices([...services, response.data]);

      // Fix: Reset form properly
      resetForm();
      setActiveTab("manageServices");
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);

      if (photo) {
        formDataToSend.append("photo", photo);
      }

      const response = await axios.put(
        `http://localhost:5000/api/provider/service/${editingService._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setServices(
        services.map((s) => (s._id === editingService._id ? response.data : s))
      );
      resetForm();
      setEditingService(null);
      setActiveTab("manageServices");
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/provider/service/${serviceId}`
      );
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      categoryId: "",
    });
    setPhoto(null);
    setPhotoPreview(null);
  };

  const startEdit = (service) => {
    setFormData({
      title: service.title || "",
      description: service.description || "",
      price: service.price || "",
      categoryId: service.categoryId || "",
    });
    setPhoto(null);
    setPhotoPreview(null);
    setEditingService(service);
    setActiveTab("createService");
  };

  const cancelEdit = () => {
    setEditingService(null);
    resetForm();
  };

  const Overview = () => (
    <div className="row g-4 mt-3">
      <div className="col-md-2">
        <div className="card p-3 shadow-sm">
          <h5>Total Services</h5>
          <h3>{services.length}</h3>
        </div>
      </div>
      <div className="col-md-2">
        <div className="card p-3 shadow-sm">
          <h5>Total Bookings</h5>
          <h3>{bookings.length}</h3>
        </div>
      </div>
      <div className="col-md-2">
        <div className="card p-3 shadow-sm">
          <h5>Jobs Completed</h5>
          <h3>{bookings.filter((b) => b.status === "completed").length}</h3>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h5>Total Earnings</h5>
          <h3>${profileData?.totalEarnings?.toFixed(2) || "0.00"}</h3>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h5>Rating</h5>
          <h3>{profileData?.Rating?.toFixed(2) || "0.00"}</h3>
        </div>
      </div>
      <div className="col-6 mt-3">
        <div className="card p-3 shadow-sm">
          <h5>Recent Reviews</h5>
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            <ul className="list-unstyled">
              {reviews.map((review) => (
                <li key={review._id} className="mb-3 border-bottom pb-2">
                  <strong>Service:</strong> {review.serviceId?.title || "N/A"}
                  <br />
                  <strong>Customer:</strong> {review.customerId?.name || "N/A"}
                  <br />
                  <strong>Rating:</strong> {review.rating} / 5<br />
                  <strong>Comment:</strong> {review.comment || "No comment"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  const CreateService = () => (
    <div className="mt-4">
      <h5>{editingService ? "Edit Service" : "Create New Service"}</h5>
      <form
        onSubmit={editingService ? handleUpdateService : handleCreateService}
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter service title"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="Enter service description"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            className="form-control"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="categoryId"
            className="form-control"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {providerCategory && (
              <option value={providerCategory._id}>
                {providerCategory.name}
              </option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Photo
          </label>
          <input
            id="photo"
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setPhoto(file);
              if (file) {
                setPhotoPreview(URL.createObjectURL(file));
              } else {
                setPhotoPreview(null);
              }
            }}
          />

          {photoPreview && (
            <div className="mt-3">
              <small className="text-muted">Selected Photo Preview:</small>
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Selected preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            </div>
          )}

          {editingService && editingService.photoURL && !photoPreview && (
            <div className="mt-3">
              <small className="text-muted">Current Photo:</small>
              <div className="mt-2">
                <img
                  src={`http://localhost:5000${editingService.photoURL}`}
                  alt="Current service"
                  className="img-thumbnail"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-box gap-2">
          <button type="submit" className="btn btn-primary">
            {editingService ? "Update Service" : "Create Service"}
          </button>

          {editingService && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const ManageServices = () => (
    <div className="table-responsive mt-4">
      <h5>Your Services</h5>
      {services.length === 0 ? (
        <div className="alert alert-info">
          No services found. Create your first service to get started.
        </div>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.title}</td>
                <td>{service.description}</td>
                <td>${service.price}</td>
                <td>
                  {categories.find((cat) => cat._id === service.categoryId)
                    ?.name || "N/A"}
                </td>
                <td>
                  <div className=" gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => startEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const ManageBookings = ({ bookings }) => {
    if (!bookings || !Array.isArray(bookings)) return null;
    const dateStatusMap = {};
    bookings.forEach((b) => {
      const dateStr = new Date(b.date).toDateString();
      const statusPriority = {
        completed: 1,
        accepted: 2,
        pending: 3,
        rejected: 4,
      };
      if (
        !dateStatusMap[dateStr] ||
        statusPriority[b.status] < statusPriority[dateStatusMap[dateStr]]
      ) {
        dateStatusMap[dateStr] = b.status;
      }
    });

    const acceptBooking = async (bookId) => {
      await axios.put(
        `http://localhost:5000/api/provider/booking/accept/${bookId}`
      );
      setBookings(
        bookings.map((b) =>
          b._id === bookId ? { ...b, status: "accepted" } : b
        )
      );
    };

    const rejectBooking = async (bookId) => {
      await axios.put(
        `http://localhost:5000/api/provider/booking/reject/${bookId}`
      );
      setBookings(
        bookings.map((b) =>
          b._id === bookId ? { ...b, status: "rejected" } : b
        )
      );
    };

    const tileClassName = ({ date, view }) => {
      if (view === "month") {
        const dateStr = date.toDateString();
        const status = dateStatusMap[dateStr];
        if (status) {
          switch (status) {
            case "completed":
              return "booked-completed";
            case "accepted":
              return "booked-accepted";
            case "rejected":
              return "booked-rejected";
            case "pending":
              return "booked-pending";
            default:
              return null;
          }
        }
      }
      return null;
    };

    return (
      <div className="mt-4">
        <div className="table-responsive">
          <h5>Your Bookings</h5>
          {bookings.length === 0 ? (
            <div className="alert alert-info">No bookings found.</div>
          ) : (
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>email</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === "completed"
                            ? "bg-primary"
                            : booking.status === "accepted"
                            ? "bg-success"
                            : booking.status === "rejected"
                            ? "bg-danger"
                            : booking.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>{booking.customerId?.name || "N/A"}</td>
                    <td>{booking.customerId?.tel || "N/A"}</td>
                    <td>{booking.customerId?.city || "N/A"}</td>
                    <td>{booking.customerId?.email || "N/A"}</td>
                    <td>{booking.serviceId?.title || "N/A"}</td>
                    {booking.status === "pending" && (
                      <>
                        <td>
                          <button
                            className="btn btn-accept btn-sm me-2"
                            onClick={() => acceptBooking(booking._id)}
                          >
                            <i className="bi bi-check-circle me-1"></i> Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => rejectBooking(booking._id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Refuse
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Calendar */}
        <div className="mt-5">
          <h5>Booking Calendar</h5>
          <Calendar tileClassName={tileClassName} />
        </div>

        <style>{`
          .booked-completed {
            background-color: blue !important;
            color: white !important;
            border-radius: 50%;
          }
          .booked-accepted {
            background-color: green !important;
            color: white !important;
            border-radius: 50%;
          }
          .booked-rejected {
            background-color: red !important;
            color: white !important;
            border-radius: 50%;
          }
          .booked-pending {
            background-color: yellow !important;
            color: black !important;
            border-radius: 50%;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="provider-dashboard">
      <div className="container my-4">
        <h2>Service Provider Dashboard</h2>
        <p>Manage your services and grow your business</p>

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "createService" ? "active" : ""
              }`}
              onClick={() => {
                setEditingService(null);
                resetForm();
                setActiveTab("createService");
              }}
            >
              Create Service
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "manageServices" ? "active" : ""
              }`}
              onClick={() => setActiveTab("manageServices")}
            >
              Manage Services
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "manageBookings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("manageBookings")}
            >
              Manage Bookings
            </button>
          </li>
        </ul>

        {activeTab === "overview" && <Overview />}
        {activeTab === "createService" && <CreateService />}
        {activeTab === "manageServices" && <ManageServices />}
        {activeTab === "manageBookings" && (
          <ManageBookings bookings={bookings} />
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
