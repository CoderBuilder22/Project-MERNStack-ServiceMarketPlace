import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomerDashboard.css"; // optional for custom styles

const CustomerDashboard = () => {

  // Example static bookings
  const bookings = [
    {
      id: 'B001',
      service: 'House Cleaning',
      provider: 'John Doe',
      date: '2025-11-20',
      status: 'Confirmed',
      price: 50
    },
    {
      id: 'B002',
      service: 'Plumbing',
      provider: 'Alice Smith',
      date: '2025-11-22',
      status: 'Pending',
      price: 75
    },
    {
      id: 'B003',
      service: 'Gardening',
      provider: 'Bob Johnson',
      date: '2025-11-25',
      status: 'Completed',
      price: 40
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Bookings</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Status</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id}>
                <td>{index + 1}</td>
                <td>{booking.service}</td>
                <td>{booking.provider}</td>
                <td>{booking.date}</td>
                <td>
                  <span className={`badge ${
                    booking.status === 'Confirmed' ? 'bg-success' :
                    booking.status === 'Pending' ? 'bg-warning text-dark' :
                    'bg-secondary'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td>{booking.price}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">View</button>
                  <button className="btn btn-sm btn-danger">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;
