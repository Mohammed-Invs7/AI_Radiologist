import { motion } from "framer-motion";

const EditUserModal = ({ show, onClose, onChange, onSubmit, currentUser }) => {
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
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={currentUser.first_name}
                onChange={onChange}
              />
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={currentUser.last_name}
                onChange={onChange}
              />
            </div>

            {/* Email 
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={currentUser.email}
                onChange={onChange}
              />
            </div> */}

            {/* Date of Birth */}
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                value={currentUser.date_of_birth}
                onChange={onChange}
              />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={currentUser.gender}
                onChange={onChange}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            {/* User Type */}
            <div className="mb-3">
              <label className="form-label">User Type</label>
              <select
                className="form-select"
                name="user_type"
                value={currentUser.user_type}
                onChange={onChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={onSubmit}>
              Update User
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditUserModal;
