import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../../context/AuthContext'; 
import '../../assets/Styling/Admin_Sidebar.css';
import Image1 from '../../assets/Images/Adminlogo.png';

const Admin_Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogoutClick = () => {
        setConfirmLogout(true);
    };

    const handleLogoutConfirm = async () => {
        logout();
        navigate("/");
        setConfirmLogout(false);
    };

    return (
        <div className="bg-white Admin-Sidebar py-2">
            <div className="m-2">
                <Link to={"/"}>
                    <span><img src={Image1} alt="Admin Logo" /></span>
                </Link>
                
            </div>
            <hr className="text-dark mb-4" />
            <div className="list-group list-group-flush fw-semibold">
                <Link to="/AdminDashboard" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-grid-alt fs-5 me-2"></i>
                    <span className="fs-5">Dashboard</span>
                </Link>
                <Link to="/UsersAdmin" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-user fs-4 me-2"></i>
                    <span>Users</span>
                </Link>
                <Link to="/models" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-layer fs-4 me-2"></i>
                    <span>Models</span>
                </Link>
                <Link to="/body-anatomical-region" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-body fs-4 me-2"></i>
                    <span>BodyAnatomicalRegion</span>
                </Link>
                <Link to="/radiology-details" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-detail fs-4 me-2"></i>
                    <span>RadiologyDetails</span>
                </Link>
                <Link to="/ReportsAdmin" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-file fs-4 me-2"></i>
                    <span>Report</span>
                </Link>
                <Link to="/radiology-modality" className="list-group-item d-flex align-items-center text-center">
                    <i className="bx bx-clinic fs-4 me-2"></i>
                    <span>RadiologyModality</span>
                </Link>
                <button 
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer" }} 
                    className="list-group-item fw-bold d-flex align-items-center text-center" 
                    onClick={handleLogoutClick}
                >
                    <i className="bx bx-log-out fs-4 me-2 text-danger"></i>
                    <span className="text-danger">Logout</span>

                </button>

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
            </div>
        </div>
    );
};

export default Admin_Sidebar;
