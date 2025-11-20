import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomerDashboard.css";
import axios from "axios";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const customerId = userInfo._id;

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/customer/cancel/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      alert("Reservation cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel reservation");
    }
  };

  
  useEffect(() => {
    const fetchBookings = async (customerId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/customer/bookings/${customerId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings(customerId);
  }, [customerId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return 'confirmed';
      case 'pending':
        return 'pending';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="loading-bookings">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Bookings</h1>
        <p className="dashboard-subtitle">
          Manage and track your service bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">📋</div>
          <h3>No Bookings Yet</h3>
          <p>You haven't made any service bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3 className="booking-title">
                  {booking.serviceId?.title || "Unknown Service"}
                </h3>
                <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status || "Pending"}
                </span>
              </div>

              <div className="booking-meta">
                <div className="meta-item">
                  <span className="meta-label">Booking ID</span>
                  <span className="meta-value">#{booking._id?.slice(-8)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date</span>
                  <span className="meta-value">{formatDate(booking.date)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Price</span>
                  <span className="meta-value">
                    ${booking.serviceId?.price || "0"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Provider</span>
                  <span className="meta-value">
                    {booking.providerId?.name || "Not assigned"}
                  </span>
                </div>
              </div>

              <div className="booking-actions">
                {(booking.status === "pending" || booking.status === "paid") ? (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <button
                    className="view-btn"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;