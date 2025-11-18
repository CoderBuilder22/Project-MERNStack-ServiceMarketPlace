import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NavBar = ({ setEnableTransition }) => {
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

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("userInfo");
      setUserInfo(
        storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login", { replace: true });
  };

  const getDashboardLink = () => {
    if (!userInfo) return "/login";
    switch (userInfo.role?.toLowerCase()) {
      case "admin":
        return "/admin-dashboard";
      case "provider":
        return "/provider-dashboard";
      case "customer":
        return "/customer-dashboard";
      default:
        return "/";
    }
  };

  const isLoggedIn = !!userInfo;

  console.log("User Info:", userInfo);
  console.log("Dashboard link:", getDashboardLink());

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        ServiceHub
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register" onClick={() => setEnableTransition(true)}>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={() => setEnableTransition(true)}>
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              {userInfo.role?.toLowerCase() === "customer" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/service" onClick={() => setEnableTransition(true)}>
                    Services
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to={getDashboardLink()} onClick={() => setEnableTransition(true)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
