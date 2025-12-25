import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomerDashboard.css";
import axios from "axios";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewBookingId, setActiveReviewBookingId] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState({ text: "", type: "", visible: false });
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const customerId = userInfo._id;

  const showMessage = (text, type = "success") => {
    setMessage({ text, type, visible: true });
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const closeMessage = () => {
    setMessage(prev => ({ ...prev, visible: false }));
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/customer/cancel/${bookingId}`
      );
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      showMessage("Reservation cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showMessage("Failed to cancel reservation", "error");
    }
  };

  const markAsCompleted = async (bookingId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/customer/complete/${bookingId}`,
        { customerId }
      );
      const updatedBookings = bookings.map((booking) => {
        if (booking._id === bookingId) {
          return { ...booking, status: "completed" };
        }
        return booking;
      });
      setBookings(updatedBookings);
      setActiveReviewBookingId(bookingId);
      showMessage("Booking marked as completed successfully", "success");
    } catch (error) {
      console.error("Error marking as completed:", error);
      showMessage("Failed to mark reservation as completed", "error");
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
        showMessage("Error fetching bookings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings(customerId);
  }, [customerId]);

  const submitReview = async (bookingId) => {
    const numericRating = Number(rating);
    try {
      await axios.post(`http://localhost:5000/api/customer/review`, {
        reservationId: bookingId,
        rating: numericRating,
        comment,
        customerId,
      });
      showMessage("Review submitted successfully", "success");
      setActiveReviewBookingId(null);
      setRating("");
      setComment("");
      // refresh reviews after submit
    } catch (error) {
      console.error("Error submitting review:", error);
      showMessage("Failed to submit review", "error");
    }
  };

  const handleCancelConfirmation = (bookingId) => {
    showMessage(
      "Are you sure you want to cancel this booking? Click confirm to proceed.",
      "confirmation",
      () => cancelBooking(bookingId)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
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

      <div className="dashboard-header">
        <h1 className="dashboard-title">My Bookings</h1>
        <p className="dashboard-subtitle">Manage and track your service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">📋</div>
          <h3>No Bookings Yet</h3>
          <p>You haven't made any service bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3 className="booking-title">
                    {booking.serviceId?.title || "Unknown Service"}
                  </h3>
                  <span
                    className={`booking-status ${getStatusBadgeClass(booking.status)}`}
                  >
                    {booking.status}
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
                </div>

                <div className="booking-actions">
                  {booking.status === "completed" ? (
                    activeReviewBookingId === booking._id ? (
                      <div className="review-form">
                        <label htmlFor={`rating-${booking._id}`}>
                          Rate the Provider (1–5):
                        </label>
                        <input
                          id={`rating-${booking._id}`}
                          type="number"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setRating("");
                              return;
                            }
                            const numericValue = Number(value);
                            if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
                              setRating(value);
                            }
                          }}
                          placeholder="Enter rating"
                        />

                        <label htmlFor={`comment-${booking._id}`}>Comment:</label>
                        <textarea
                          id={`comment-${booking._id}`}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience..."
                        />

                        <div className="review-buttons">
                          <button
                            onClick={() => submitReview(booking._id)}
                            disabled={!rating}
                            className="submit-review-btn"
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={() => {
                              setActiveReviewBookingId(null);
                              setRating("");
                              setComment("");
                            }}
                            className="cancel-review-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mark-review-btn"
                        onClick={() => setActiveReviewBookingId(booking._id)}
                      >
                        Add Review
                      </button>
                    )
                  ) : booking.status === "accepted" ? (
                    <button
                      className="mark-completed-btn"
                      onClick={() => markAsCompleted(booking._id)}
                    >
                      Mark as Completed
                    </button>
                  ) : booking.status === "pending" ? (
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this booking?")) {
                          cancelBooking(booking._id);
                        }
                      }}
                    >
                      Cancel Booking
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;