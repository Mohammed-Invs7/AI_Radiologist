import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const FilesAdmin = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files.");
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (id) => {
    if (!id) return;
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
        await axios.delete(
          `http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("File deleted successfully.");
        fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file.");
      }
    }
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const filesToDisplay = files.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="container-fluid mt-5">
        <div className="flex-grow-1">
          {/* Desktop Table */}
          <div className="d-none d-lg-block">
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-dark text-center align-middle">
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {filesToDisplay.map((file, idx) => (
                    <tr key={file.id}>
                      <td>{idx + 1 + currentPage * itemsPerPage}</td>
                      <td>{file.file.split("/").pop()}</td>
                      <td>{new Date(file.uploaded).toLocaleString()}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
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

          {/* Mobile Cards */}
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

          {/* Pagination */}
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
    </div>
  );
};

export default FilesAdmin;
