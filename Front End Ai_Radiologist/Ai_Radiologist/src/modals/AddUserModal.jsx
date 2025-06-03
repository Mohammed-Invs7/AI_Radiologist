import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const AddUserModal = ({ show, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!show) return null;

  const onFormSubmit = (data) => {
    onSubmit(data);
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
            <h5 className="modal-title">Add User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body d-flex justify-content-center ">
            <form style={{width:"400px"}} onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />
                {errors.first_name && (
                  <p className="text-danger">{errors.first_name.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("date_of_birth", {
                    required: "Date of birth is required",
                  })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password1", {
                    required: "Password is required",
                  })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password2", {
                    required: "Confirm password is required",
                  })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">User Type</label>
                <select
                  className="form-select"
                  {...register("user_type", {
                    required: "User type is required",
                  })}
                >
                  <option value={2}>User</option>
                  <option value={1}>Admin</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddUserModal;
