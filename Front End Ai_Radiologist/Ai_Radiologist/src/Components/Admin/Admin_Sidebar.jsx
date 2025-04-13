import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; 
import '../../assets/Styling/Admin_Sidebar.css';
import Image1 from '../../assets/Images/Adminlogo.png';
import Swal from "sweetalert2";

const Admin_Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

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

                
            </div>
        </div>
    );
};

export default Admin_Sidebar;
