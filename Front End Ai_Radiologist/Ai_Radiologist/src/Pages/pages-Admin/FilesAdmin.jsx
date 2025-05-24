import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import EditFileModal from "../../modals/EditFileModal";
import { BASE_URL } from "../../config";

const API_Files = `${BASE_URL}/admin/ai_models/model-files/`;

const FilesAdmin = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelFilter, setModelFilter] = useState("");
  const itemsPerPage = 10;

  const fetchFiles = async (token) => {
    try {
      const res = await axios.get(API_Files, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      toast.error("Failed to load files.");
      throw error;
    }
  };

  const deleteFile = async (fileId, token) => {
    try {
      const res = await axios.delete(`${API_Files}${fileId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      toast.error("Failed to delete file.");
      throw error;
    }
  };

  const fetchFilesData = async () => {
    try {
      const data = await fetchFiles(token);
      setFiles(data);
      setFilteredFiles(data);
    } catch (error) {}
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
      text: "This action cannot be undone.",
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
      } catch (error) {}
    }
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleRename = async (newName) => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_Files}${selectedFile.id}/rename/`,
        { new_name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("File renamed successfully.");
      fetchFilesData();
      setShowRenameModal(false);
    } catch (error) {
      toast.error("Failed to rename file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setModelFilter(e.target.value);
    if (e.target.value === "") {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(
        files.filter((file) =>
          file.model_name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const filesToDisplay = filteredFiles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i
            className="bx bx-file me-2"
            style={{ color: "#4c74af", fontSize: "24px" }}
          ></i>
          Files Model
        </h4>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by model name..."
          value={modelFilter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table - Desktop */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>#</th>
              <th>Model Name</th>
              <th>File Name</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filesToDisplay.map((file, idx) => (
              <tr key={file.id}>
                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                <td>{file.model_name}</td>
                <td>{file.file.split("/").pop()}</td>
                <td>{new Date(file.uploaded).toLocaleString()}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <i
                      className="bx bx-edit text-warning"
                      style={{ cursor: "pointer" }}
                      title="Rename"
                      onClick={() => {
                        setSelectedFile({
                          id: file.id,
                          name: file.file.split("/").pop(),
                        });
                        setShowRenameModal(true);
                      }}
                    ></i>
                    <i
                      className="bx bx-show text-primary"
                      style={{ cursor: "pointer" }}
                      title="View"
                      onClick={() => handleView(file.file)}
                    ></i>
                    <i
                      className="bx bx-trash text-danger"
                      style={{ cursor: "pointer" }}
                      title="Delete"
                      onClick={() => handleDelete(file.id)}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card - Mobile */}
      <div className="d-md-none">
        <div className="row row-cols-1 g-3">
          {filesToDisplay.map((file, idx) => (
            <div className="col" key={file.id}>
              <div className="card border shadow-sm">
                <div className="card-body">
                  <p>
                    <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
                  </p>
                  <p>
                    <strong>Model:</strong> {file.model}
                  </p>
                  <p>
                    <strong>File:</strong> {file.file.split("/").pop()}
                  </p>
                  <p>
                    <strong>Uploaded:</strong>{" "}
                    {new Date(file.uploaded).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-end gap-3">
                    <i
                      className="bx bx-edit text-warning fs-5"
                      onClick={() => {
                        setSelectedFile({
                          id: file.id,
                          name: file.file.split("/").pop(),
                        });
                        setShowRenameModal(true);
                      }}
                      title="Rename"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="bx bx-show text-primary fs-5"
                      onClick={() => handleView(file.file)}
                      title="View"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="bx bx-trash text-danger fs-5"
                      onClick={() => handleDelete(file.id)}
                      title="Delete"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <ReactPaginate
        pageCount={Math.ceil(filteredFiles.length / itemsPerPage)}
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

      {/* Rename Modal */}
      <EditFileModal
        show={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRename}
        loading={loading}
        currentName={selectedFile?.name}
      />
    </div>
  );
};

export default FilesAdmin;
