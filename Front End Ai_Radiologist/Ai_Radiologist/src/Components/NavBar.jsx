import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "../assets/NavBar.css";
import Logo from "../Components/Logo";

const NavBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // 🔹 مرجع للقائمة المنسدلة

    // Logout function
    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate("/");
        }
    };

    // ✅ إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <nav className="nav container">
                {/* Logo */}
                <Link to="/" className="nav__logo">
                <Logo/>
                </Link>

                {/* Navigation Menu */}
                <div className={`nav__menu ${menuOpen ? "show-menu" : ""}`}>
                    <ul className="nav__list">
                        {["Home", "Oue Goals", "How Use It", "Our Team"].map(
                            (item, index) => (
                                <li key={index}>
                                    <Link 
                                        to="/" 
                                        className="nav__link" 
                                        onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Close button */}
                    <div className="nav__close" onClick={() => setMenuOpen(false)}>
                        <i className="bx bx-x"></i>
                    </div>
                </div>

                <div className="nav__actions">
                    {/* User Profile Section */}
                    {user ? (
                        <div className="dropdown" ref={dropdownRef}>
                            <div
                                className="dropdown__profile"
                                onClick={() => setDropdownOpen((prev) => !prev)} // 🔹 تبديل القائمة عند النقر
                                aria-expanded={dropdownOpen}
                            >
                                <div className="dropdown__image">
                                    <img
                                        src={user.profile_image || "/default-avatar.png"}
                                        alt="Profile"
                                    />
                                </div>
                                <div className="dropdown__names">
                                    <h3>{user.first_name} {user.last_name}</h3>
                                </div>
                            </div>

                            {/* Dropdown List */}
                            <ul 
                                className={`dropdown__list ${dropdownOpen ? "show-dropdown" : ""}`} 
                                aria-labelledby="userMenu"
                            >
                                <div className="d-flex align-items-center mb-2">
                                    <img width={"40px"}
                                        src={user.profile_image || "/default-avatar.png"}
                                        alt="Profile"
                                    />
                                    <h6 className="mx-2" style={{fontSize:"12px"}}>{user.first_name} {user.last_name}</h6>
                                </div>
                                <li>
                                    <Link className="dropdown__link" to="/profile_User">
                                        <i className="bx bx-user me-2"></i> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown__link" to="/Settings_User">
                                        <i className="bx bx-cog me-2"></i> Settings
                                    </Link>
                                </li>
                                <li>
                                    <button className="dropdown__link text-danger" onClick={handleLogout}>
                                        <i className="bx bx-log-out me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <button className="Btn-Go-Reg" onClick={() => navigate("/Registration")}>
                            <span className="Btn-Go-Reg-span">Registration</span>
                        </button>
                    )}

                    {/* Toggle button */}
                    <div className="nav__toggle" onClick={() => setMenuOpen(true)}>
                        <i className="bx bx-menu"></i>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
