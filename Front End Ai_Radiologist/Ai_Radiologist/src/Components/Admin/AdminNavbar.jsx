import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Logo from "../Logo";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogoutClick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out from your account.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            backdrop: true,
        }).then((result) => {
            if (result.isConfirmed) {
                logout();         
                navigate("/");  
                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been logged out successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    const pageTitles = {
        "/AdminPanel": "Dashboard",
        "/AdminPanel/UsersAdmin": "Users Management",
        "/AdminPanel/ReportsAdmin": "Reports Management",
    };

    const getPageTitle = () => pageTitles[location.pathname];

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
        <header className="header mb-3">
            <nav className="nav container-fluid justify-content-between w-100 mx-3 mx-sm-5">
                <div className="row w-100">
                    <div className="col-4 col-md-2 d-flex align-items-center flex-column flex-md-row">
                        <Logo />
                    </div>

                    <div className="col-4 col-md-5 d-flex justify-content-center align-items-center">
                        <h3>{getPageTitle()}</h3>
                    </div>

                    <div className="col-4 col-md-4 d-flex justify-content-end align-items-center">
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

                                <ul
                                    className={`dropdown__list ${dropdownOpen ? "show-dropdown" : ""}`}
                                    aria-labelledby="userMenu"
                                >
                                    <div className="d-flex align-items-center mb-2">
                                        <img width={"40px"} src={user.profile_image || "/default-avatar.png"} alt="Profile" />
                                        <h6 className="mx-2" style={{ fontSize: "12px" }}>
                                            {user.first_name} {user.last_name}
                                        </h6>
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
                </div>
            </nav>
        </header>
    );
};

export default AdminNavbar;
