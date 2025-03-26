import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";  
import "../assets/Styling/NavBar.css";
import Logo from "../Components/Logo";

const NavBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogoutClick = () => {
        setDropdownOpen(false); 
        setConfirmLogout(true);
    };

    const handleLogoutConfirm = async () => {
        logout();
        navigate("/");
        setConfirmLogout(false);
    };

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (!dropdownRef.current?.contains(event.target)) setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


    return (
        <header className="header">
            <nav className="nav container">
                {/* Logo */}
                <Link to="/" className="nav__logo">
                    <Logo />
                </Link>

                {/* Navigation Menu */}
                <div className={`nav__menu ${menuOpen ? "show-menu" : ""}`}>
                    <ul className="nav__list">
                        {["Home", "Our Goals", "How Use It", "Our Team"].map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to="/" 
                                    className="nav__link" 
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
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
                                onClick={() => setDropdownOpen(prev => !prev)}
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
                                    <button 
                                        style={{ background: "none", border: "none", cursor: "pointer" }} 
                                        className="dropdown__link text-danger" 
                                        onClick={handleLogoutClick}
                                    >
                                        <i className="bx bx-log-out me-2 text-danger"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <button className="btn-go-reg" onClick={() => navigate("/Registration")}>
                            <span className="btn-go-reg-span">Registration</span>
                        </button>
                    )}

                    {/* Toggle button */}
                    <div className="nav__toggle" onClick={() => setMenuOpen(true)}>
                        <i className="bx bx-menu"></i>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {confirmLogout && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-box">
                        <h3>Logout</h3>
                        <p>Are you sure you want to log out?</p>
                        <div className="logout-buttons">
                            <button onClick={() => setConfirmLogout(false)} className="logout-no">No</button>
                            <button onClick={handleLogoutConfirm} className="logout-yes">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavBar;
