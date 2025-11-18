import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceProviderDashboard.css";

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return;
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/provider/services/provider/${userInfo._id}`),
          axios.get("http://localhost:5000/api/admin/categories"),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/provider/service", {
        ...formData,
        providerId: userInfo._id,
      });
      setServices([...services, response.data]);
      setFormData({ title: "", description: "", price: "", categoryId: "" });
      setActiveTab("manageServices");
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/provider/service/${editingService._id}`, formData);
      setServices(services.map(s => s._id === editingService._id ? response.data : s));
      setFormData({ title: "", description: "", price: "", categoryId: "" });
      setEditingService(null);
      setActiveTab("manageServices");
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/provider/service/${serviceId}`);
      setServices(services.filter(s => s._id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const startEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      categoryId: service.categoryId,
    });
    setEditingService(service);
    setActiveTab("createService");
  };

  const Overview = () => (
    <div className="row g-4 mt-3">
      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h5>Total Services</h5>
          <h3>{services.length}</h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h5>Total Earnings</h5>
          <h3>$0</h3> {/* Placeholder, implement if backend provides */}
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h5>Jobs Completed</h5>
          <h3>0</h3> {/* Placeholder */}
        </div>
      </div>
    </div>
  );

  const CreateService = () => (
    <div className="mt-4">
      <h5>{editingService ? "Edit Service" : "Create New Service"}</h5>
      <form onSubmit={editingService ? handleUpdateService : handleCreateService}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select
            className="form-control"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingService ? "Update Service" : "Create Service"}
        </button>
        {editingService && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingService(null);
              setFormData({ title: "", description: "", price: "", categoryId: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );

  const ManageServices = () => (
    <div className="table-responsive mt-4">
      <h5>Your Services</h5>
      <table className="table align-middle table-striped">
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
          {services.map((s) => (
            <tr key={s._id}>
              <td>{s.title}</td>
              <td>{s.description}</td>
              <td>${s.price}</td>
              <td>{categories.find(c => c._id === s.categoryId)?.name || "N/A"}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(s)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteService(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="provider-dashboard">
      <div className="container my-4">
        <h2>Service Provider Dashboard</h2>
        <p>Manage your services</p>

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
            className={`nav-link ${activeTab === "createService" ? "active" : ""}`}
            onClick={() => setActiveTab("createService")}
          >
            Create Service
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "manageServices" ? "active" : ""}`}
            onClick={() => setActiveTab("manageServices")}
          >
            Manage Services
          </button>
        </li>
      </ul>

        {activeTab === "overview" && <Overview />}
        {activeTab === "createService" && <CreateService />}
        {activeTab === "manageServices" && <ManageServices />}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
