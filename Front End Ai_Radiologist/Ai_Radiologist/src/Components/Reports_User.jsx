import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ReportModal from "../modals/ReportModal";
import "../assets/Styling/Reports_User.css";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://127.0.0.1:8000/api/v1/user/reports/";
const REPORT_API = "http://127.0.0.1:8000/api/v1/admin/users/reports/";

const Reports_User = () => {
  const [radiologyData, setRadiologyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRadiologyData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleViewReport = async (id) => {
    try {
      const response = await axios.get(`${REPORT_API}${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSelectedReport(response.data); // Set the selected report details
      setShowModal(true); // Show the modal with report details
    } catch (err) {
      setError("Error fetching report details: " + err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setRadiologyData(radiologyData.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your report has been deleted.", "success");
        } catch (err) {
          setError("Error deleting report: " + err.message);
          Swal.fire(
            "Error!",
            "There was an issue deleting the report.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="container mt-3">
      <div
        className="bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center"
        style={{
          background:
            "linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)",
        }}
      >
        <h6>Your Radiology Reports</h6>
        <button className="btn-blue btn-add-radiology d-flex align-items-center">
          <Link to={"/Upload"}>Add New Radiology Image</Link>
          <i
            style={{ color: "black", fontSize: "20px" }}
            className="bx bx-plus"
          ></i>
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : error ? (
        <p className="text-center mt-4 text-danger">Error: {error}</p>
      ) : radiologyData.length > 0 ? (
        radiologyData.map((item) => (
          <div
            key={item.id}
            className="card p-2 my-2 d-flex flex-row align-items-center shadow-sm"
          >
            <img
              src={item.image_path}
              alt={item.title}
              width={80}
              height={80}
              className="rounded me-3"
            />
            <div className="flex-grow-1">
              <h6 className="m-0 text-primary">{item.title}</h6>
              <small className="text-muted">
                {" "}
                {new Date(item.report_date).toLocaleDateString()}
              </small>
              <br />
              <small>
                <strong>Modality:</strong> {item.radiology_modality}
              </small>
              <br />
              <small>
                <strong>Region:</strong> {item.body_anatomical_region}
              </small>
            </div>
            <div className="d-flex gap-1">
              <button
                className="button btn-view"
                onClick={() => handleViewReport(item.id)}
              >
                {" "}
                View
              </button>
              <button
                className="button btn-delete"
                onClick={() => handleDelete(item.id)}
              >
                {" "}
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-3 text-muted">
          No radiology reports available.
        </p>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between text-muted small mt-3">
        <p>
          Showing {radiologyData.length} of {radiologyData.length} Reports
        </p>
        <div className="d-flex gap-3">
          <button className="button button-back">Prev</button>
          <button className="button button-next">Next</button>
        </div>
      </div>

      {showModal && selectedReport && (
        <ReportModal
          selectedReport={selectedReport}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Reports_User;
