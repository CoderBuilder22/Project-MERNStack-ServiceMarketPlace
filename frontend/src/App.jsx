import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import Home from "./pages/Home.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import UpdatePassword from "./pages/Auth/UpdatePassword.jsx";

import NavBar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import CustomerDashboard from "./pages/dashboard/CustomerDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import ServiceProviderDashboard from "./pages/dashboard/ServiceProviderDashboard.jsx";

function App() {
  const PrivateRoute = ({ children, role }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) return <Navigate to="/login" replace />;
    if (role && userInfo.role?.toLowerCase() !== role.toLowerCase()) {
      switch (userInfo.role?.toLowerCase()) {
        case "customer":
          return <Navigate to="/customer-dashboard" replace />;
        case "admin":
          return <Navigate to="/admin-dashboard" replace />;
        case "provider":
          return <Navigate to="/provider-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    return children;
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password/:userId" element={<UpdatePassword />} />

        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute role="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <PrivateRoute role="provider">
              <ServiceProviderDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
