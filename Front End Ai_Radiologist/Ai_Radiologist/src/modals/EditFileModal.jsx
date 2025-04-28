import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditFileModal = ({ show, onClose, onFileUpdated, token, fileId }) => {
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newFile) {
      toast.error("Please select a new file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      setLoading(true);
      await axios.put(
        `http://127.0.0.1:8000/api/v1/admin/ai_models/model-files/${fileId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File updated successfully.");
      onFileUpdated(); // تحديث اللستة
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update file.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <form onSubmit={handleUpdate}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit File</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setNewFile(e.target.files[0])}
                required
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFileModal;
