import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

// Define your API URLs
const API_MODALITIES = `${BASE_URL}/admin/ai_models/modalities/`;
const API_ANATOMIES = `${BASE_URL}/admin/ai_models/anatomies/`;

const AddRadiologyDetailModal = ({ show, onClose, onAdd, value, onChange }) => {
  const { token } = useAuth();
  const [modalities, setModalities] = useState([]);
  const [anatomies, setAnatomies] = useState([]);

  useEffect(() => {
    if (show) {
      fetchModalities();
      fetchAnatomies();
    }
  }, [show]);

  const fetchModalities = async () => {
    try {
      const response = await axios.get(API_MODALITIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalities(response.data);
    } catch (error) {
      console.error("Failed to fetch modalities:", error);
    }
  };

  const fetchAnatomies = async () => {
    try {
      const response = await axios.get(API_ANATOMIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnatomies(response.data);
    } catch (error) {
      console.error("Failed to fetch anatomies:", error);
    }
  };

  if (!show) return null;

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
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Radiology Detail</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Select Modality</label>
            <select
              className="form-select mb-2"
              value={value.radio_mod_id}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  radio_mod_id: e.target.value,
                }))
              }
            >
              <option value="">-- Select Modality --</option>
              {modalities.map((modality) => (
                <option key={modality.id} value={modality.id}>
                  {modality.name}
                </option>
              ))}
            </select>

            <label className="form-label">Select Anatomical Region</label>
            <select
              className="form-select"
              value={value.body_ana_id}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  body_ana_id: e.target.value,
                }))
              }
            >
              <option value="">-- Select Anatomy --</option>
              {anatomies.map((anatomy) => (
                <option key={anatomy.id} value={anatomy.id}>
                  {anatomy.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                onAdd();
                onClose();
              }}
              disabled={!value.radio_mod_id || !value.body_ana_id}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddRadiologyDetailModal;
