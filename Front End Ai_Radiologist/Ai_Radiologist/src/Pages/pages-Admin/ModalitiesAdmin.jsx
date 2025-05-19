import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../config";
import AddModalitieModal from "../../modals/AddModalitieModel";
import EditModalitieModal from "../../modals/EditModalitieModel";

const API_MODALITIES = `${BASE_URL}/admin/ai_models/modalities/`;

const ModalitiesAdmin = () => {
  const { token } = useAuth();
  const [modalities, setModalities] = useState([]);
  const [newModality, setNewModality] = useState("");
  const [editModality, setEditModality] = useState({ id: null, name: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchModalities();
  }, []);

  const fetchModalities = async () => {
    try {
      const res = await axios.get(API_MODALITIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalities(res.data);
    } catch (error) {
      console.error("Error fetching modalities:", error);
    }
  };

  const handleAdd = async () => {
    if (!newModality.trim()) {
      setErrorMessage("Name is required.");
      return false;
    }
    try {
      await axios.post(
        API_MODALITIES,
        { name: newModality },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Modality added.");
      setNewModality("");
      setErrorMessage("");
      fetchModalities();
      return true;
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add modality.");
    }
  };

  const handleEdit = async () => {
    try {
      await axios.patch(
        `${API_MODALITIES}${editModality.id}/`,
        { name: editModality.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Modality updated.");
      setEditModality({ id: null, name: "" });
      fetchModalities();
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update modality.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the modality.",
      icon: "warning",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_MODALITIES}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Modality deleted.");
        fetchModalities();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete modality.");
      }
    }
  };

  const modalitiesToDisplay = modalities.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i
            className="bx bx-heart me-2"
            style={{ color: "#4c74af", fontSize: "24px" }}
          ></i>
          Radiology Modalities
        </h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="d-none d-lg-block">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {modalitiesToDisplay.map((modality, idx) => (
              <tr key={modality.id}>
                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                <td>{modality.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <i
                      className="bx bx-edit text-warning"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditModality(modality)}
                      title="Edit"
                    ></i>
                    <i
                      className="bx bx-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(modality.id)}
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
          {modalitiesToDisplay.map((modality, idx) => (
            <div className="col" key={modality.id}>
              <div className="card shadow-sm p-3">
                <p>
                  <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
                </p>
                <p>
                  <strong>Name:</strong> {modality.name}
                </p>
                <div className="d-flex justify-content-end gap-3">
                  <i
                    className="bx bx-edit text-warning fs-5"
                    onClick={() => setEditModality(modality)}
                    title="Edit"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="bx bx-trash text-danger fs-5"
                    onClick={() => handleDelete(modality.id)}
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
        pageCount={Math.ceil(modalities.length / itemsPerPage)}
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

      <AddModalitieModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrorMessage("");
        }}
        onAdd={handleAdd}
        value={newModality}
        onChange={(e) => {
          setNewModality(e.target.value);
          setErrorMessage("");
        }}
        errorMessage={errorMessage}
      />

      {/* Edit Modal */}
      <EditModalitieModal
        show={editModality.id !== null}
        onClose={() => setEditModality({ id: null, name: "" })}
        modalitie={editModality}
        onChange={setEditModality}
        onSave={handleEdit}
      />
    </div>
  );
};

export default ModalitiesAdmin;
