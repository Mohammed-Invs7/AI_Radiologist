import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../assets/Styling/NavBar.css";
import Logo from "../Components/Logo";
import Swal from "sweetalert2";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/AI_Radiologist/Login");
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/AI_Radiologist/Home" },
    { name: "Our Vision", path: "/AI_Radiologist/Home" },
    { name: "Upload", path: "/AI_Radiologist/Upload" },
    { name: "How Use It", path: "/AI_Radiologist/Home" },
  ];

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/AI_Radiologist" className="nav__logo p-0">
          <Logo />
        </Link>

        <div className={`nav__menu mt-3 ${menuOpen ? "show-menu" : ""}`}>
          <ul className="nav__list">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav__close" onClick={() => setMenuOpen(false)}>
            <i className="bx bx-x"></i>
          </div>
        </div>

        <div className="nav__actions pt-2">
          {user ? (
            <div className="dropdown" ref={dropdownRef}>
              <div
                className="dropdown__profile"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="dropdown__image">
                  <img src={user.profile_image || "/default-avatar.png"} />
                </div>
                <div className="dropdown__names">
                  <h3>
                    {user.first_name} {user.last_name}
                  </h3>
                </div>
              </div>

              <ul
                className={`dropdown__list ${
                  dropdownOpen ? "show-dropdown" : ""
                }`}
              >
                <div className="d-flex align-items-center mb-2">
                  <img
                    width={"40px"}
                    src={user.profile_image || "/default-avatar.png"}
                  />
                  <h6 className="mx-2" style={{ fontSize: "12px" }}>
                    {user.first_name} {user.last_name}
                  </h6>
                </div>
                <li>
                  <Link
                    className="dropdown__link"
                    to="/AI_Radiologist/profile_User"
                  >
                    <i className="bx bx-user me-2"></i> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown__link"
                    to="/AI_Radiologist/Settings_User"
                  >
                    <i className="bx bx-cog me-2"></i> Settings
                  </Link>
                </li>
                {user.user_type === "admin" && (
                  <li>
                    <Link
                      className="dropdown__link"
                      to="/AI_Radiologist/AdminPanel"
                    >
                      <i className="bx bx-grid-alt me-2"></i> Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    className="dropdown__link text-danger"
                    onClick={handleLogoutClick}
                  >
                    <i className="bx bx-log-out me-2 text-danger"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn-go-reg"
              onClick={() => navigate("/AI_Radiologist/Registration")}
            >
              <span className="btn-go-reg-span">Registration</span>
            </button>
          )}

          <div className="nav__toggle" onClick={() => setMenuOpen(true)}>
            <i className="bx bx-menu"></i>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
