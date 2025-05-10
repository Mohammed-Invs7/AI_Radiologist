import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../config";
import AddRadiologyDetailModal from "../../modals/AddRadiologyDetailModal";
import EditRadiologyDetailModal from "../../modals/EditRadiologyDetailModal";

const API_RADIOLOGY_DETAILS = `${BASE_URL}/admin/ai_models/radiology-details/`;

const RadiologyDetailsAdmin = () => {
  const { token } = useAuth();
  const [details, setDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    radio_mod_id: "",
    body_ana_id: "",
  });
  const [editDetail, setEditDetail] = useState({
    id: null,
    radio_mod_id: "",
    body_ana_id: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(API_RADIOLOGY_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetails(res.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleAdd = async () => {
    const { radio_mod_id, body_ana_id } = newDetail;
    if (!radio_mod_id || !body_ana_id)
      return toast.error("All fields are required.");
    try {
      await axios.post(API_RADIOLOGY_DETAILS, newDetail, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Radiology detail added.");
      setNewDetail({ radio_mod_id: "", body_ana_id: "" });
      fetchDetails();
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add radiology detail.");
    }
  };

  const handleEdit = async () => {
    const { id, radio_mod_id, body_ana_id } = editDetail;
    if (!radio_mod_id || !body_ana_id)
      return toast.error("All fields are required.");
    try {
      await axios.put(
        `${API_RADIOLOGY_DETAILS}${id}/`,
        { radio_mod_id, body_ana_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Radiology detail updated.");
      setEditDetail({ id: null, radio_mod_id: "", body_ana_id: "" });
      setShowEditModal(false);
      fetchDetails();
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update radiology detail.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the radiology detail.",
      icon: "warning",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_RADIOLOGY_DETAILS}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Radiology detail deleted.");
        fetchDetails();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete radiology detail.");
      }
    }
  };

  const detailsToDisplay = details.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i
            className="bx bx-health me-2"
            style={{ color: "#4c74af", fontSize: "24px" }}
          ></i>
          Radiology Details
        </h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add
        </button>
      </div>

      {/* Table for Desktop */}
      <div className="d-none d-lg-block">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>#</th>
              <th>Modality</th>
              <th>Anatomy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {detailsToDisplay.map((detail, idx) => (
              <tr key={detail.id}>
                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                <td>{detail.radio_modality.name}</td>
                <td>{detail.anatomical_region.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <i
                      className="bx bx-edit text-warning"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditDetail({
                          id: detail.id,
                          radio_mod_id: detail.radio_modality.id,
                          body_ana_id: detail.anatomical_region.id,
                        });
                        setShowEditModal(true);
                      }}
                      title="Edit"
                    ></i>
                    <i
                      className="bx bx-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(detail.id)}
                      title="Delete"
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-lg-none">
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {detailsToDisplay.map((detail, idx) => (
            <div className="col" key={detail.id}>
              <div className="card shadow-sm p-3">
                <p>
                  <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
                </p>
                <p>
                  <strong>Modality:</strong> {detail.radio_modality.name}
                </p>
                <p>
                  <strong>Region:</strong> {detail.anatomical_region.name}
                </p>
                <div className="d-flex justify-content-end gap-3">
                  <i
                    className="bx bx-edit text-warning fs-5"
                    onClick={() => {
                      setEditDetail({
                        id: detail.id,
                        radio_mod_id: detail.radio_modality.id,
                        body_ana_id: detail.anatomical_region.id,
                      });
                      setShowEditModal(true);
                    }}
                    title="Edit"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="bx bx-trash text-danger fs-5"
                    onClick={() => handleDelete(detail.id)}
                    title="Delete"
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <ReactPaginate
        pageCount={Math.ceil(details.length / itemsPerPage)}
        onPageChange={(e) => setCurrentPage(e.selected)}
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />

      {/* Add Modal */}
      <AddRadiologyDetailModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
        value={newDetail}
        onChange={setNewDetail}
      />

      {/* Edit Modal */}
      <EditRadiologyDetailModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditDetail({ id: null, radio_mod_id: "", body_ana_id: "" });
        }}
        onSave={handleEdit}
        value={editDetail}
        onChange={setEditDetail}
      />
    </div>
  );
};

export default RadiologyDetailsAdmin;
