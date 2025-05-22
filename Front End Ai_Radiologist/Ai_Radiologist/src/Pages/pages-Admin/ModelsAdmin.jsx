import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddModelModal from "../../modals/AddModelModal";
import EditModelModal from "../../modals/EditModelModal";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../config";

const API_MODELS = `${BASE_URL}/admin/ai_models/models/`;
const API_SEL = `${BASE_URL}/admin/ai_models/radio-options/`;


const ModelsAdmin = () => {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [nameTerm, setnameTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalitiesFilter, setModalitiesFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentModel, setCurrentModel] = useState({});
  const [regionFilter, setRegionFilter] = useState("all");
  const [modalitiesWithRegions, setModalitiesWithRegions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchModels();
    fetchModalitiesWithRegions();
  }, []);

  const fetchModalitiesWithRegions = async () => {
    try {
      const res = await axios.get(API_SEL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalitiesWithRegions(res.data);
    } catch (error) {
      console.error("Error fetching modalities with regions:", error);
    }
  };
  const selectedRegions =
    modalitiesWithRegions.find(
      (item) => item.modality.id === parseInt(modalitiesFilter)
    )?.regions || [];

  useEffect(() => {
    filterModels();
  }, [models, nameTerm, statusFilter, modalitiesFilter, regionFilter]);

  const filterModels = () => {
    console.log("Filtering models with:", {
      nameTerm,
      statusFilter,
      modalitiesFilter,
      regionFilter,
    });

    if (modalitiesFilter === "all") {
      setRegionFilter("all");
    }

    let filtered = models.filter((model) => {
      const searchMatch = model.name
        ?.toLowerCase()
        .includes(nameTerm.toLowerCase());

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && model.active_status) ||
        (statusFilter === "inactive" && !model.active_status);

      const modalityMatch =
        modalitiesFilter === "all" ||
        model.modalities?.id === parseInt(modalitiesFilter);

      const regionMatch =
        regionFilter === "all" ||
        model.anatomies?.id === parseInt(regionFilter);

      return searchMatch && statusMatch && modalityMatch && regionMatch;
    });

    setFilteredModels(filtered);
  };

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_MODELS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(res.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this model? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_MODELS}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Model deleted successfully.");
        fetchModels();
      } catch (error) {
        console.error("Error deleting model:", error);
        toast.error("An error occurred while deleting the model.");
      }
    }
  };

  const handleEdit = (model) => {
    setCurrentModel({
      name: model.name || "",
      description: model.description || "",
      active_status: model.active_status ? "true" : "false",
      body_ana: model.anatomies ? model.anatomies.id : "",
      radio_mod: model.modalities ? model.modalities.id : "",
      upload_files: [],
    });
    setEditId(model.id);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "upload_files") {
      setCurrentModel((prev) => ({ ...prev, upload_files: files }));
    } else {
      setCurrentModel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const res = await axios.patch(
        `${API_MODELS}${editId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Model updated successfully.");
      setShowEditModal(false);
      fetchModels();
    } catch (error) {
      console.error(
        "Error updating model:",
        error.response?.data || error.message
      );
      toast.error("Failed to update the model.");
    }
  };

  const handleAddModel = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("radio_mod", data.radio_mod);
      formData.append("body_ana", data.body_ana);
      formData.append("active_status", data.active_status);

      for (let i = 0; i < data.upload_files.length; i++) {
        formData.append("upload_files", data.upload_files[i]);
      }

      await axios.post(`${API_MODELS}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Model added successfully!");
      setShowAddModal(false);
      fetchModels();
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model.");
    }
  };

  const modelsToDisplay = filteredModels.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i
            className="bx bx-layer me-2"
            style={{ color: "#4c74af", fontSize: "24px" }}
          ></i>
          Models
        </h4>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Model
        </button>
      </div>

      {/* Search and Filters */}
      <div className="row mb-3">
        <div className="col-5 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search models..."
            value={nameTerm}
            onChange={(e) => setnameTerm(e.target.value)}
          />
        </div>
        <div className="col-2 mb-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-2 mb-2">
          <select
            className="form-select"
            value={modalitiesFilter}
            onChange={(e) => setModalitiesFilter(e.target.value)}
          >
            <option value="all">All Modalities</option>
            {modalitiesWithRegions.map((item) => (
              <option key={item.modality.id} value={item.modality.id}>
                {item.modality.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2 mb-2">
          {" "}
          <select
            className="form-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="all">All Regions</option>
            {modalitiesFilter !== "all" &&
              selectedRegions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* TABLE FOR DESKTOP */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Active</th>
              <th>Modality</th>
              <th>Anatomy</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {modelsToDisplay.map((model, idx) => (
              <tr key={model.id}>
                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                <td>{model.name}</td>
                <td>{model.description}</td>
                <td>
                  {model.active_status ? (
                    <i
                      className="bx bx-check-circle text-success fs-4 fw-bold"
                      title="Active"
                    ></i>
                  ) : (
                    <i
                      className="bx bx-x-circle text-danger fs-4 fw-bold"
                      title="Inactive"
                    ></i>
                  )}
                </td>
                <td>{model.modalities?.name || "-"}</td>
                <td>{model.anatomies?.name || "-"}</td>
                <td>{model.upload_date}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <i
                      className="bx bx-edit text-warning"
                      onClick={() => handleEdit(model)}
                      title="Edit"
                    ></i>
                    <i
                      className="bx bx-trash text-danger"
                      onClick={() => handleDelete(model.id)}
                      title="Delete"
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS FOR MOBILE */}
      <div className="d-block d-md-none">
        {modelsToDisplay.map((model, idx) => (
          <div key={model.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <p>
                <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
              </p>
              <h5 className="card-title fw-bold">{model.name}</h5>
              <p className="card-text">
                <strong>Description:</strong> {model.description}
              </p>
              <p className="card-text">
                <strong>Modality:</strong> {model.modalities?.name || "-"}
              </p>
              <p className="card-text">
                <strong>Anatomy:</strong> {model.anatomies?.name || "-"}
              </p>
              <p className="card-text">
                <strong>Upload Date:</strong> {model.upload_date}
              </p>
              <p className="card-text">
                <strong>Status:</strong>{" "}
                {model.active_status ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Inactive</span>
                )}
              </p>
              <div className="d-flex justify-content-end gap-3">
                <i
                  className="bx bx-edit text-warning fs-5"
                  onClick={() => handleEdit(model)}
                  title="Edit"
                ></i>
                <i
                  className="bx bx-trash text-danger fs-5"
                  onClick={() => handleDelete(model.id)}
                  title="Delete"
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReactPaginate
        pageCount={Math.ceil(filteredModels.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />

      <AddModelModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        handleAddModel={handleAddModel}
      />

      <EditModelModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        currentModel={currentModel}
      />
    </div>
  );
};

export default ModelsAdmin;
