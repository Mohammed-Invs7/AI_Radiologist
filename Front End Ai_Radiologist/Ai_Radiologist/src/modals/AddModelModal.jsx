import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";

const API_SEL = `${BASE_URL}/admin/ai_models/radio-options/`;

const AddModelModal = ({
  show,
  onClose,
  handleAddModel,
  register,
  handleSubmit,
  errors,
}) => {
  const { token } = useAuth();
  const [radioOptions, setRadioOptions] = useState([]);
  const [selectedModality, setSelectedModality] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    const fetchRadioOptions = async () => {
      try {
        const res = await axios.get(`${API_SEL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    setSelectedRegion("");
  };

  const onSubmit = async (data) => {
    try {
      await handleAddModel(data);
    } catch (error) {
      console.error("Error from parent handler:", error);
    }
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setUploadedFiles(files.map((file) => file.name));

    const newFormData = new FormData();
    files.forEach((file) => newFormData.append("upload_files", file));

    setFormData(newFormData);
  };

  return (
    <motion.div
      className="modal show d-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add AI Model</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div  className="modal-body">
            <form  onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  style={{ resize: "none", overflow: "hidden" }}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-danger">{errors.description.message}</p>
                )}
              </div>

              {/* Radiology Modality */}
              <div className="mb-3">
                <label className="form-label">Radiology Modality</label>
                <select
                  className="form-select"
                  {...register("radio_mod", {
                    required: "Radiology Modality is required",
                  })}
                  value={selectedModality}
                  onChange={handleModalityChange}
                >
                  <option value="">Select Modality</option>
                  {radioOptions.map((option) => (
                    <option key={option.modality.id} value={option.modality.id}>
                      {option.modality.name}
                    </option>
                  ))}
                </select>
                {errors.radio_mod && (
                  <p className="text-danger">{errors.radio_mod.message}</p>
                )}
              </div>

              {/* Body Anatomy */}
              {selectedModality && (
                <div className="mb-3">
                  <label className="form-label">Body Anatomy</label>
                  <select
                    className="form-select"
                    {...register("body_ana", {
                      required: "Body Anatomy is required",
                    })}
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {radioOptions
                      .find(
                        (opt) => opt.modality.id === parseInt(selectedModality)
                      )
                      ?.regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                  </select>
                  {errors.body_ana && (
                    <p className="text-danger">{errors.body_ana.message}</p>
                  )}
                </div>
              )}

              {/* Active Status */}
              <div className="mb-3">
                <label className="form-label">Active Status</label>
                <select
                  className="form-select"
                  {...register("active_status", {
                    required: "Active status is required",
                  })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errors.active_status && (
                  <p className="text-danger">{errors.active_status.message}</p>
                )}
              </div>

              {/* Upload Files */}
              <div className="mb-3">
                <label className="form-label">Upload Files</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  {...register("upload_files", {
                    required: "Files are required",
                  })}
                  onChange={handleFileChange}
                />
              </div>
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

              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  Add Model
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddModelModal;
