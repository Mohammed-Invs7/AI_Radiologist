import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API_RADIO_OPTIONS = `${BASE_URL}/admin/ai_models/radio-options/`;

const EditModelModal = ({
  show,
  onClose,
  onChange,
  onSubmit,
  currentModel,
}) => {
  const { token } = useAuth();
  const [radioOptions, setRadioOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    const fetchRadioOptions = async () => {
      try {
        const res = await axios.get(`${API_RADIO_OPTIONS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRadioOptions(res.data);
      } catch (error) {
        console.error("Error fetching radio options:", error);
      }
    };
    fetchRadioOptions();
  }, [token]);

  if (!show) return null;

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files).map((file) => file.name);
    setUploadedFiles(filesArray);

    const newFormData = new FormData();
    Array.from(files).forEach((file) => {
      newFormData.append("upload_files", file);
    });
    setFormData(newFormData);
  };

 const handleSubmit = (e) => {
   e.preventDefault();
   const updatedFormData = new FormData();

   updatedFormData.append("name", currentModel.name);
   updatedFormData.append("description", currentModel.description);
   updatedFormData.append("active_status", String(currentModel.active_status));
   updatedFormData.append("radio_mod", String(currentModel.radio_mod));
   updatedFormData.append("body_ana", String(currentModel.body_ana));

   if (formData.getAll("upload_files").length > 0) {
     formData.getAll("upload_files").forEach((file) => {
       updatedFormData.append("upload_files", file);
     });
   }

   onSubmit(updatedFormData);
 };


  return (
    <motion.div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit AI Model</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Model Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={currentModel.name}
                  onChange={onChange}
                />
              </div>

              {/* Model Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={currentModel.description}
                  onChange={onChange}
                  placeholder="Enter your description here"
                  rows="4"
                  style={{ resize: "none", overflow: "hidden" }}
                ></textarea>
              </div>

              {/* Active Status */}
              <div className="mb-3">
                <label className="form-label">Active Status</label>
                <select
                  className="form-select"
                  name="active_status"
                  value={currentModel.active_status}
                  onChange={onChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              {/* Radiology Modality */}
              <div className="mb-3">
                <label className="form-label">Radiology Modality</label>
                <select
                  className="form-select"
                  name="radio_mod"
                  value={currentModel.radio_mod || ""}
                  onChange={onChange}
                >
                  <option value="">Select Modality</option>
                  {radioOptions.map((option) => (
                    <option key={option.modality.id} value={option.modality.id}>
                      {option.modality.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Anatomy */}
              <div className="mb-3">
                <label className="form-label">Body Anatomy</label>
                <select
                  className="form-select"
                  name="body_ana"
                  value={currentModel.body_ana || ""}
                  onChange={onChange}
                >
                  <option value="">Select Region</option>
                  {radioOptions
                    .find(
                      (option) =>
                        option.modality.id === parseInt(currentModel.radio_mod)
                    )
                    ?.regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Upload Files */}
              <div className="mb-3">
                <label className="form-label">Upload Files</label>
                <input
                  type="file"
                  name="upload_files"
                  className="form-control"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {/* Display uploaded files */}
              <div className="mb-3">
                {uploadedFiles.length > 0 && (
                  <div>
                    <h6>Uploaded Files:</h6>
                    <ul>
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="modal-footer">
                <button className="btn btn-success" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditModelModal;
