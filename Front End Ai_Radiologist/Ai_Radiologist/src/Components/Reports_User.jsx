import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import ReportModal from "../modals/ReportModal";
import "../assets/Styling/Reports_User.css";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";
import ReactPaginate from "react-paginate";

const API_REPORTS = `${BASE_URL}/user/reports/`;

const Reports_User = () => {
  const [radiologyData, setRadiologyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_REPORTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = response.data.sort(
          (a, b) => new Date(b.report_date) - new Date(a.report_date)
        );

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
      const response = await axios.get(`${API_REPORTS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedReport(response.data);
      setShowModal(true);
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
          await axios.delete(`${API_REPORTS}${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
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

  // Pagination
  const offset = currentPage * itemsPerPage;
  const currentItems = radiologyData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(radiologyData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container">
      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : error ? (
        <p className="text-center mt-4 text-danger">Error: {error}</p>
      ) : currentItems.length > 0 ? (
        currentItems.map((item) => (
          <div
            key={item.id}
            className="card p-2 my-1 d-flex flex-row align-items-center shadow-sm"
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
                View
              </button>
              <button
                className="button btn-delete"
                onClick={() => handleDelete(item.id)}
              >
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

      {/* Pagination Component */}
      {radiologyData.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center mt-4"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      )}

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
