import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { user, logout } = useAuth();
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

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes("/UsersAdmin")) return "Users Management";
        if (path.includes("/ReportsAdmin")) return "Reports Management ";
        if (path.includes("/admin/settings")) return "Settings";
        if (path.includes("/AdminDashboard")) return "Dashboard";
    };

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
            <nav style={{ width: "90%" }} className="nav container justify-content-between">
                {/* ✅ العنوان المتغير */}
                <div>
                    <h3>{getPageTitle()}</h3>
                </div>

                <div className="nav__actions">
                    {user ? (
                        <div className="dropdown" ref={dropdownRef}>
                            <div
                                className="dropdown__profile"
                                onClick={() => setDropdownOpen(prev => !prev)}
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
                                    <h6 className="mx-2" style={{ fontSize: "12px" }}>{user.first_name} {user.last_name}</h6>
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
                                    <Link className="dropdown__link" to="/AdminDashboard">
                                        <i className="bx bx-grid-alt me-2"></i> Dashboard
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

export default AdminNavbar;
