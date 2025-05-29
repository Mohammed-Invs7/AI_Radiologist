import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/Styling/Admin_Sidebar.css";
import Swal from "sweetalert2";

const Admin_Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
        navigate("/");
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

  return (
    <div className="bg-white Admin-Sidebar py-2 d-flex flex-column">
      <div className="list-group list-group-flush fw-semibold">
        <Link
          to="/AI_Radiologist/AdminPanel"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-bar-chart-alt-2 fs-5 me-2"></i>
          <span className="fs-5">Dashboard</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Users Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-user fs-4 me-2"></i>
          <span>Users</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Models Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-layer fs-4 me-2"></i>
          <span>Models</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Files Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-file fs-4 me-2"></i>
          <span>Files</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Modalities Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-heart fs-4 me-2"></i>
          <span>Modalities</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Anatomies Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-body fs-4 me-2"></i>
          <span>Anatomies</span>
        </Link>
        <Link
          to="/AI_Radiologist/AdminPanel/RadiologyDetails Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-health fs-4 me-2"></i>
          <span>RadiologyDetails</span>
        </Link>

        <Link
          to="/AI_Radiologist/AdminPanel/Reports Admin"
          className="list-group-item d-flex align-items-center text-center"
        >
          <i className="bx bx-detail fs-4 me-2"></i>
          <span>Reports</span>
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
