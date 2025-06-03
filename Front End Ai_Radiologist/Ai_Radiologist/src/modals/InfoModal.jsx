import { motion } from "framer-motion";
import * as yup from "yup";

export const schema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "First name must contain letters only"),
  last_name: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Last name must contain letters only"),
  gender: yup.string().required("Gender is required"),
});

const InfoModal = ({
  show,
  onClose,
  onSave,
  loading,
  previewImage,
  register,
  errors,
  onImageChange,
}) => {
  if (!show) return null;

  return (
    <motion.div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-dialog">
        <div className="modal-content align-items-center">
          <form onSubmit={onSave}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Personal Info</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div style={{width: "400px"}} className="modal-body ">
              <div className="d-flex align-items-center flex-column">
                {previewImage && (
                  <div
                    className="mb-3 text-center align-items-center rounded-circle border border-dark bg-white shadow"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="rounded-circle"
                      style={{
                        width: "118px",
                        height: "118px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <label className="custom-upload-button">
                  Change your Image
                  <input
                    type="file"
                    className="hidden-file-input"
                    name="profile_image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) onImageChange(file);
                    }}
                  />
                </label>
              </div>

              <div className="mb-3">
                <label>First Name</label>
                <motion.input
                  type="text"
                  className={`form-control ${
                    errors.first_name ? "is-invalid" : ""
                  }`}
                  {...register("first_name")}
                  whileFocus={{ scale: 1.05 }}
                />
                {errors.first_name && (
                  <div className="invalid-feedback">
                    {errors.first_name.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label>Last Name</label>
                <motion.input
                  type="text"
                  className={`form-control ${
                    errors.last_name ? "is-invalid" : ""
                  }`}
                  {...register("last_name")}
                  whileFocus={{ scale: 1.05 }}
                />
                {errors.last_name && (
                  <div className="invalid-feedback">
                    {errors.last_name.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label>Gender</label>
                <select
                  className={`form-control ${
                    errors.gender ? "is-invalid" : ""
                  }`}
                  {...register("gender")}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">
                    {errors.gender.message}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-center">
              <motion.button
                type="submit"
                className="btn-blue btn-primary w-75"
                disabled={loading}
                whileHover={{ scale: 1.1 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoModal;
