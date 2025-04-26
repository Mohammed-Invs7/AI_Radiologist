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

const ModelsAdmin = () => {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentModel, setCurrentModel] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/models/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        await axios.delete(
          `http://127.0.0.1:8000/api/v1/admin/ai_models/models/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      body_ana: model.body_ana || "",
      radio_mod: model.radio_mod || "",
      upload_files: [],
    });
    setEditId(model.id);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "upload_files") {
      setCurrentModel((prev) => ({
        ...prev,
        upload_files: files,
      }));
    } else {
      setCurrentModel((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(currentModel)) {
        if (key === "upload_files") {
          for (let i = 0; i < value.length; i++) {
            formData.append("upload_files", value[i]);
          }
        } else {
          formData.append(key, value);
        }
      }

      await axios.put(
        `http://127.0.0.1:8000/api/v1/admin/ai_models/models/${editId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowEditModal(false);
      toast.success("Model updated successfully.");
      fetchModels();
    } catch (error) {
      console.error("Error updating model:", error);
      toast.error("Failed to update model.");
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (key === "upload_files") {
          value.forEach((file) => {
            formData.append("upload_files", file);
          });
        } else {
          formData.append(key, value);
        }
      }

      await axios.post(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/models/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowAddModal(false);
      toast.success("Model added successfully.");
      fetchModels();
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model.");
    }
  };

  const modelsToDisplay = models.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Model
        </button>
      </div>

      <div className="table-responsive">
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
                <td>{model.active_status ? "✅" : "❌"}</td>
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

      <ReactPaginate
        pageCount={Math.ceil(models.length / itemsPerPage)}
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
        onSubmit={handleSubmit(handleAddSubmit)}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
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
