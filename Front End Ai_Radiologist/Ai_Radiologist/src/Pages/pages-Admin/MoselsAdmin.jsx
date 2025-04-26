import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const ModelsAdmin = () => {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [anatomies, setAnatomies] = useState([]);
  const [modelFiles, setModelFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchModels();
    fetchModalities();
    fetchAnatomies();
    fetchModelFiles();
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
      toast.error("Failed to load models.");
    }
  };

  const fetchModalities = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/modalities/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalities(res.data);
    } catch (error) {
      console.error("Error fetching modalities:", error);
      toast.error("Failed to load modalities.");
    }
  };

  const fetchAnatomies = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/anatomies/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnatomies(res.data);
    } catch (error) {
      console.error("Error fetching anatomies:", error);
      toast.error("Failed to load anatomies.");
    }
  };

  const fetchModelFiles = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModelFiles(res.data);
    } catch (error) {
      console.error("Error fetching model files:", error);
      toast.error("Failed to load model files.");
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
        toast.error("Failed to delete model.");
      }
    }
  };

  const handleEdit = (id) => {
    console.log("Edit model with ID:", id);
  };

  const handleView = (id) => {
    console.log("View model details for ID:", id);
  };

  const modelsToDisplay = models.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="container-fluid">
        <div className="flex-grow-1">
          {/* Desktop Table */}
          <div className="d-none d-lg-block">
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
                  {modelsToDisplay.length > 0 ? (
                    modelsToDisplay.map((model, idx) => (
                      <tr key={model.id}>
                        <td>{idx + 1 + currentPage * itemsPerPage}</td>
                        <td>{model.name}</td>
                        <td>{model.description}</td>
                        <td>{model.active_status ? "✅" : "❌"}</td>
                        <td>
                          {modalities.find(
                            (modality) => modality.id === model.modality_id
                          )?.name || "-"}
                        </td>
                        <td>
                          {anatomies.find(
                            (anatomy) => anatomy.id === model.anatomy_id
                          )?.name || "-"}
                        </td>
                        <td>{model.upload_date}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <i
                              className="bx bx-show text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleView(model.id)}
                              title="View"
                            ></i>
                            <i
                              className="bx bx-edit text-warning"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEdit(model.id)}
                              title="Edit"
                            ></i>
                            <i
                              className="bx bx-trash text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDelete(model.id)}
                              title="Delete"
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No models available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="d-block d-lg-none">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {modelsToDisplay.length > 0 ? (
                modelsToDisplay.map((model, idx) => (
                  <div className="col" key={model.id}>
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <p>
                          <strong>Num:</strong>{" "}
                          {idx + 1 + currentPage * itemsPerPage}
                        </p>
                        <p>
                          <strong>Name:</strong> {model.name}
                        </p>
                        <p>
                          <strong>Description:</strong> {model.description}
                        </p>
                        <p>
                          <strong>Active:</strong>{" "}
                          {model.active_status ? "✅" : "❌"}
                        </p>
                        <p>
                          <strong>Modality:</strong>{" "}
                          {modalities.find(
                            (modality) => modality.id === model.modality_id
                          )?.name || "-"}
                        </p>
                        <p>
                          <strong>Anatomy:</strong>{" "}
                          {anatomies.find(
                            (anatomy) => anatomy.id === model.anatomy_id
                          )?.name || "-"}
                        </p>
                        <p>
                          <strong>Upload Date:</strong> {model.upload_date}
                        </p>
                        <div className="d-flex justify-content-between mx-4">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleView(model.id)}
                          >
                            <i className="bx bx-show"></i> View
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(model.id)}
                          >
                            <i className="bx bx-edit"></i> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(model.id)}
                          >
                            <i className="bx bx-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    No models available
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
};

export default ModelsAdmin;
