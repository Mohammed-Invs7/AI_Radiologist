import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EditModelModal = ({
  show,
  onClose,
  onChange,
  onSubmit,
  currentModel,
}) => {
  const { token } = useAuth();
  const [radioOptions, setRadioOptions] = useState([]);
  const [selectedModality, setSelectedModality] = useState(
    currentModel.radio_mod
  );
  const [selectedRegion, setSelectedRegion] = useState(currentModel.body_ana);

  useEffect(() => {
    const fetchRadioOptions = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/admin/ai_models/radio-options/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRadioOptions(res.data);
      } catch (error) {
        console.error("Error fetching radio options:", error);
      }
    };

    fetchRadioOptions();
  }, [token]);

  if (!show) return null;

  const handleModalityChange = (e) => {
    setSelectedModality(e.target.value);
    setSelectedRegion(""); // Reset selected region when modality changes
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Now you can call the onSubmit function passed from the parent,
    // assuming it handles the API call or further logic.
    onSubmit();
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
          <div className="modal-body d-flex justify-content-center">
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
                  style={{
                    resize: "none",
                    overflow: "hidden",
                  }}
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
                  value={selectedModality}
                  onChange={(e) => {
                    handleModalityChange(e);
                    onChange(e); // Trigger change event
                  }}
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
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    onChange(e); // Trigger change event
                  }}
                >
                  <option value="">Select Region</option>
                  {radioOptions
                    .find(
                      (option) =>
                        option.modality.id === parseInt(selectedModality)
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
                  onChange={onChange}
                />
              </div>

              {/* Submit Button */}
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit">
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
