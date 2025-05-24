import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../config";
import AddAnatomyModal from "../../modals/AddAnatomyModal";
import EditAnatomyModal from "../../modals/EditAnatomyModal";

const API_ANATOMIES = `${BASE_URL}/admin/ai_models/anatomies/`;

const AnatomiesAdmin = () => {
  const { token } = useAuth();
  const [anatomies, setAnatomies] = useState([]);
  const [newAnatomy, setNewAnatomy] = useState("");
  const [editAnatomy, setEditAnatomy] = useState({ id: null, name: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnatomies();
  }, []);

  // Fetch the list of anatomies from the API and update the state
  const fetchAnatomies = async () => {
    try {
      const res = await axios.get(API_ANATOMIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnatomies(res.data);
    } catch (error) {
      console.error("Error fetching anatomies:", error);
    }
  };

  // Handle adding a new anatomy after validating the input
  const handleAdd = async () => {
    if (!newAnatomy.trim()) {
      setErrorMessage("Name is required.");
      return false;
    }
    try {
      await axios.post(
        API_ANATOMIES,
        { name: newAnatomy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Region added.");
      setNewAnatomy("");
      setErrorMessage("");
      fetchAnatomies();
      return true;
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add region.");
      return false;
    }
  };

  // Handle editing an existing anatomy by sending updated data to the API
  const handleEdit = async () => {
    try {
      await axios.patch(
        `${API_ANATOMIES}${editAnatomy.id}/`,
        { name: editAnatomy.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Region updated.");
      setEditAnatomy({ id: null, name: "" });
      fetchAnatomies();
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update region.");
    }
  };

  // Handle deleting an anatomy after user confirmation via Swal dialog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the region.",
      icon: "warning",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_ANATOMIES}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Region deleted.");
        fetchAnatomies();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete region.");
      }
    }
  };

  const anatomiesToDisplay = anatomies.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i
            className="bx bx-body me-2"
            style={{ color: "#4c74af", fontSize: "24px" }}
          ></i>
          Anatomical Regions
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
            {anatomiesToDisplay.map((anatomy, idx) => (
              <tr key={anatomy.id}>
                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                <td>{anatomy.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <i
                      className="bx bx-edit text-warning"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditAnatomy(anatomy)}
                      title="Edit"
                    ></i>
                    <i
                      className="bx bx-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(anatomy.id)}
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
          {anatomiesToDisplay.map((anatomy, idx) => (
            <div className="col" key={anatomy.id}>
              <div className="card shadow-sm p-3">
                <p>
                  <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
                </p>
                <p>
                  <strong>Name:</strong> {anatomy.name}
                </p>
                <div className="d-flex justify-content-end gap-3">
                  <i
                    className="bx bx-edit text-warning fs-5"
                    onClick={() => setEditAnatomy(anatomy)}
                    title="Edit"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="bx bx-trash text-danger fs-5"
                    onClick={() => handleDelete(anatomy.id)}
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
        pageCount={Math.ceil(anatomies.length / itemsPerPage)}
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
      <AddAnatomyModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrorMessage("");
        }}
        onAdd={handleAdd}
        value={newAnatomy}
        onChange={(e) => {
          setNewAnatomy(e.target.value);
          setErrorMessage("");
        }}
        errorMessage={errorMessage}
      />

      {/* Edit Modal */}
      <EditAnatomyModal
        show={editAnatomy.id !== null}
        onClose={() => setEditAnatomy({ id: null, name: "" })}
        anatomy={editAnatomy}
        onChange={setEditAnatomy}
        onSave={handleEdit}
      />
    </div>
  );
};

export default AnatomiesAdmin;
