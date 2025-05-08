import { motion } from "framer-motion";

const AddModalitieModal = ({ show, onClose, onAdd, value, onChange }) => {
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
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Modalitie</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <input
                className="form-control"
                placeholder="Modalitie name"
                value={value}
                onChange={onChange}
              />
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
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddModalitieModal;
