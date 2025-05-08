import { useState } from "react";

const AddFileModal = ({ show, onClose, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [modelId, setModelId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(files, modelId); 
  };

  if (!show) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Files</h5>
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
                  Files
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
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
                  onChange={(e) => setModelId(e.target.value)}
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
