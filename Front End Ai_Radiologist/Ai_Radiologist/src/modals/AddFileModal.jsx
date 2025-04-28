import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddFileModal = ({ show, onClose, onFileAdded, token }) => {
  const [file, setFile] = useState(null);
  const [modelId, setModelId] = useState("");

  // دالة لاختيار الملف
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // دالة لاختيار النموذج
  const handleModelIdChange = (e) => {
    setModelId(e.target.value);
  };

  // دالة لتحميل الملف
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !modelId) {
      toast.error("Please select a file and model.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", modelId);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File added successfully.");
      onFileAdded(); // لتحديث قائمة الملفات بعد إضافة الملف الجديد
      onClose(); // لإغلاق المودال
    } catch (error) {
      console.error(
        "Error uploading files: ",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `Error uploading files: ${
          error.response ? error.response.data.detail : error.message
        }`
      );
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New File</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="file" className="form-label">
                  File
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="modelId" className="form-label">
                  Model ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="modelId"
                  value={modelId}
                  onChange={handleModelIdChange}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
