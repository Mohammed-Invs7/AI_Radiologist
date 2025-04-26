import { motion } from "framer-motion";

const AddModelModal = ({
  show,
  onClose,
  onSubmit,
  handleSubmit,
  register,
  errors,
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
            <h5 className="modal-title">Add New AI Model</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  className="form-control"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-danger">{errors.description.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Active Status</label>
                <select
                  className="form-select"
                  {...register("active_status", {
                    required: "Status is required",
                  })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Body Anatomy (ID)</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("body_ana", {
                    required: "Body Anatomy is required",
                  })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Radiology Modality (ID)</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("radio_mod", {
                    required: "Radiology Modality is required",
                  })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Files</label>
                <input
                  type="file"
                  multiple
                  className="form-control"
                  {...register("upload_files", {
                    required: "Files are required",
                  })}
                />
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
