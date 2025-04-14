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
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {[
              { name: "first_name", label: "First Name" },
              { name: "last_name", label: "Last Name" },
              { name: "email", label: "Email", type: "email" },
              { name: "date_of_birth", label: "Date of Birth", type: "date" },
            ].map(({ name, label, type = "text" }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={currentUser[name]}
                  onChange={onChange}
                />
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={currentUser.gender} onChange={onChange}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">User Type</label>
              <select className="form-select" name="user_type" value={currentUser.user_type} onChange={onChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={onSubmit}>Update</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditUserModal;
