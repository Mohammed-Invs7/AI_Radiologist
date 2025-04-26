import { motion } from "framer-motion";

const EditModelModal = ({
  show,
  onClose,
  onChange,
  onSubmit,
  currentModel,
}) => {
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
              <input
                type="text"
                className="form-control"
                name="description"
                value={currentModel.description}
                onChange={onChange}
              />
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

            {/* Body Anatomy */}
            <div className="mb-3">
              <label className="form-label">Body Anatomy (ID)</label>
              <input
                type="number"
                className="form-control"
                name="body_ana"
                value={currentModel.body_ana}
                onChange={onChange}
              />
            </div>

            {/* Radiology Modality */}
            <div className="mb-3">
              <label className="form-label">Radiology Modality (ID)</label>
              <input
                type="number"
                className="form-control"
                name="radio_mod"
                value={currentModel.radio_mod}
                onChange={onChange}
              />
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
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditModelModal;
