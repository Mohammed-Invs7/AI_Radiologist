import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import AddFileModal from "../../modals/AddFileModal";
import EditFileModal from "../../modals/EditFileModal";

const fetchFiles = async (token) => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    toast.error("Failed to load files.");
    throw error;
  }
};

const deleteFile = async (fileId, token) => {
  try {
    const res = await axios.delete(
      `http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/${fileId}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error("Failed to delete file.");
    throw error;
  }
};

const addFile = async (file, modelId, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", modelId);

    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding file:", error);
    toast.error("Failed to add file.");
    throw error;
  }
};

const editFile = async (fileId, file, modelId, token) => {
  try {
    const formData = new FormData();
    formData.append("model", modelId);
    if (file) {
      formData.append("file", file);
    }

    const res = await axios.patch(
      `http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/${fileId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error editing file:", error);
    toast.error("Failed to edit file.");
    throw error;
  }
};

const FilesAdmin = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const itemsPerPage = 10;

  const fetchFilesData = async () => {
    try {
      const files = await fetchFiles(token);
      setFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFilesData();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (fileId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this file? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteFile(fileId, token);
        toast.success("File deleted successfully.");
        fetchFilesData();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleEditFile = async (file, modelId) => {
    try {
      await editFile(selectedFileId, file, modelId, token);
      toast.success("File updated successfully.");
      fetchFilesData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing file:", error);
    }
  };

  const filesToDisplay = files.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="container-fluid ">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add New File
            </button>
          </div>

          <div className="d-none d-lg-block">
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-dark text-center align-middle">
                  <tr>
                    <th>#</th>
                    <th>Model</th>
                    <th>File</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {filesToDisplay.map((file, idx) => (
                    <tr key={file.id}>
                      <td>{idx + 1 + currentPage * itemsPerPage}</td>{" "}
                      <td>{file.model}</td>
                      <td>{file.file.split("/").pop()}</td>
                      <td>{new Date(file.uploaded).toLocaleString()}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <i
                            className="bx bx-edit text-warning"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedFileId(file.id);
                              setShowEditModal(true);
                            }}
                            title="Edit"
                          ></i>
                          <i
                            className="bx bx-show text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleView(file.file)}
                            title="View"
                          ></i>
                          <i
                            className="bx bx-trash text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(file.id)}
                            title="Delete"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-block d-lg-none">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filesToDisplay.map((file, idx) => (
                <div className="col" key={file.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <p>
                        <strong>Num:</strong>{" "}
                        {idx + 1 + currentPage * itemsPerPage}
                      </p>
                      <p>
                        <strong>File:</strong> {file.file.split("/").pop()}
                      </p>
                      <p>
                        <strong>Uploaded:</strong>{" "}
                        {new Date(file.uploaded).toLocaleString()}
                      </p>
                      <div className="d-flex justify-content-between mx-4">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleView(file.file)}
                        >
                          <i className="bx bx-show"></i> View
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(file.id)}
                        >
                          <i className="bx bx-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ReactPaginate
            pageCount={Math.ceil(files.length / itemsPerPage)}
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

      <AddFileModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFileAdded={fetchFilesData}
        token={token}
      />
      <EditFileModal
        show={showEditModal}
        fileId={selectedFileId}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditFile}
        token={token}
      />
    </div>
  );
};

export default FilesAdmin;
