import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const NavBar = ({ setEnableTransition }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActiveLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
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
                  <Link 
                    className={`nav-link ${isActiveLink("/register")}`} 
                    to="/register" 
                    onClick={() => setEnableTransition(true)}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActiveLink("/login")}`} 
                    to="/login" 
                    onClick={() => setEnableTransition(true)}
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                {userInfo.role?.toLowerCase() === "customer" && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${isActiveLink("/service")}`} 
                      to="/service" 
                      onClick={() => setEnableTransition(true)}
                    >
                      Services
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActiveLink("/profile")}`} 
                    to="/profile" 
                    onClick={() => setEnableTransition(true)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActiveLink(getDashboardLink())}`} 
                    to={getDashboardLink()} 
                    onClick={() => setEnableTransition(true)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="nav-user-info">
                    <span className="user-welcome">Welcome, {userInfo.name || userInfo.email}</span>
                  </div>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;