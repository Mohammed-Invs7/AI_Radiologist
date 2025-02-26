import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are imported
import Logo from "./Logo";
import "../assets/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Logout function
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
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
              <Link className="nav-link Nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/OurGoals">Our Goals</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/HowToUseIt">How To Use It</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Nav-link" to="/OurTeam">Our Team</Link>
            </li>
          </ul>
        </div>

        {/* User Profile Section */}
        {user ? (
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
              <img 
                src={user.profile_image || "/default-avatar.png"} // Provide a default image
                alt="Profile" 
                className="rounded-circle me-2" 
                width="50" 
                height="50" 
              />
              {user.first_name} {user.last_name}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <Link className="dropdown-item" to="/profile_User">
                  <i className="bi bi-person-circle me-2"></i> Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/Settings_User">
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
          <button className="Btn-Go-Reg" onClick={() => navigate("/Registration")}>
            <span className="Btn-Go-Reg-span">Registration</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
