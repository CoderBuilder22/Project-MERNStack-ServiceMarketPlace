import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaUsers, FaBoxOpen, FaTags, FaShoppingBag } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, p, s, c] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users"),
          axios.get("http://localhost:5000/api/admin/service-providers"),
          axios.get("http://localhost:5000/api/admin/services"),
          axios.get("http://localhost:5000/api/admin/categories"),
        ]);
        setUsers(u.data);
        setServiceProviders(p.data);
        setServices(s.data);
        setCategories(c.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const blockUser = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/block-user/${id}`);
    setUsers(
      users.map((u) => (u._id === id ? { ...u, status: "Blocked" } : u))
    );
  };

  const unBlockUser = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/unblock-user/${id}`);
    setUsers(
      users.map((u) => (u._id === id ? { ...u, status: "Active" } : u))
    );
  }

  const createCategory = async (name) => {
    const res = await axios.post(
      `http://localhost:5000/api/admin/create-category`,
      { name }
    );
    setCategories([...categories, res.data]);
  };

  const deleteCategory = async (categoryId) => {
    await axios.delete(
      `http://localhost:5000/api/admin/delete-category/${categoryId}`
    );
    setCategories(categories.filter((c) => c._id !== categoryId));
  };

  const Overview = () => (
    <div className="row g-4 mt-3">
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <FaUsers size={25} className="text-primary mb-2" />
          <h5>Total Users</h5>
          <h3>{users.length}</h3>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <FaShoppingBag size={25} className="text-success mb-2" />
          <h5>Service Providers</h5>
          <h3>{serviceProviders.length}</h3>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <FaBoxOpen size={25} className="text-info mb-2" />
          <h5>Active Services</h5>
          <h3>{services.length}</h3>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <FaTags size={25} className="text-danger mb-2" />
          <h5>Categories</h5>
          <h3>{categories.length}</h3>
        </div>
      </div>
    </div>
  );

  const UsersTable = () => (
    <div className="table-responsive mt-4">
      <h5>All Users</h5>
      <table className="table align-middle table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className="badge bg-light text-dark">{u.role}</span>
              </td>
              <td>
                <span
                  className={`badge ${
                    u.isBlocked === true ? "bg-danger" : "bg-success"
                  }`}
                >
                  {u.isBlocked === true ? "Blocked" : "Active"}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    u.isBlocked === true ? "btn-secondary" : "btn-danger"
                  }`}
                  onClick={u.isBlocked === true ? () => unBlockUser(u._id) : () => blockUser(u._id)}
                >
                  {u.isBlocked === true ? "Blocked" : "block User"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ProvidersTable = () => (
    <div className="table-responsive mt-4">
      <h5>Service Providers</h5>
      <table className="table align-middle table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Jobs done</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceProviders.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>⭐ {p.Rating}</td>
              <td>{p.jobsCompleted} Jobs</td>
              <td>
                <span
                  className={`badge ${
                    p.isBlocked === true ? "bg-danger" : "bg-success"
                  }`}
                >
                  {p.isBlocked === true ? "Blocked" : "Active"}
                </span>
              </td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    p.isBlocked === true ? "btn-secondary" : "btn-danger"
                  }`}
                  onClick={p.isBlocked === true ? () => unBlockUser(p._id) : () => blockUser(p._id)}
                  
                >
                  {p.isBlocked === true ? "Blocked" : "block Provider"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CategoryTable = () => {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name.trim()) return;
      createCategory(name);
      setName("");
    };

    return (
      <div className="table-responsive mt-4">
        <h5>Categories</h5>

        <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>

        <table className="table align-middle table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCategory(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="container my-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p>Manage users, services, and categories</p>

      {/* Tabs */}
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
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "providers" ? "active" : ""}`}
            onClick={() => setActiveTab("providers")}
          >
            Providers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </li>
      </ul>

        {/* Tab content */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "users" && <UsersTable />}
        {activeTab === "providers" && <ProvidersTable />}
        {activeTab === "categories" && <CategoryTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;
