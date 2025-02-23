import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import Logo from "./Logo";
import "./NavBar.css"; 
import axios from "axios";

// Backend server URL
    const API_URL = "http://127.0.0.1:8000/api/v1/auth/logout/";
const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is in localStorage and set the user state
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  // Handle user logout
  const handleLogout  = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          await axios.post(`${API_URL}`, {}, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          setUser(null);
          navigate("/");

        } else {
          console.error("No token found in localStorage");
        }
      } catch (error) {
        console.error("Eroor during logout:", error);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Logo section */}
        <Logo />

        {/* Toggle button for small screens */}
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

        {/* Navigation links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/OueGoles">
                Our Goals
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/HowUseIt">
                How Use It
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/OurTeam">
                Our Team
              </Link>
            </li>
          </ul>
        </div>

        {/* User section */}
        {user ? (
          <div className="dropdown">
            {/* User profile dropdown */}
            <button className="btn btn-light dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={user.profilePic} alt="" className="rounded-circle me-2" width="35" height="35" />
              {user.username}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <Link className="dropdown-item" to="/profile_Page">
                  <i className="bi bi-person-circle me-2"></i> Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  <i className="bi bi-gear me-2"></i> Settings
                </Link>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* Registration button if user is not logged in */
          <button className="Btn-Go-Reg" onClick={() => navigate("/Registration")}>
            <span className="Btn-Go-Reg-span">Registration</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
