import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import * as yup from "yup";

export const passwordSchema = yup.object().shape({
  new_password1: yup
    .string()
    .required("Password is required")
    .min(8, "Min 8 characters"),

  new_password2: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("new_password1")], "Passwords must match"),
});

const PasswordModal = ({ show, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const onSubmit = async (data) => {
    setPasswordMessage("");
    try {
      await onSave(data);
      onClose();
    } catch {
      setPasswordMessage("An unexpected error occurred.");
    }
  };

  const handleClose = () => {
    setValue("new_password1", "");
    setValue("new_password2", "");
    onClose();
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div style={{width: "400px"}} className="modal-body">
              <div className="mb-3">
                <label>New Password</label>
                <motion.div whileFocus={{ scale: 1.05 }}>
                  <motion.input
                    type="password"
                    className={`form-control ${
                      errors.new_password1 ? "is-invalid" : ""
                    }`}
                    {...register("new_password1")}
                    whileFocus={{ scale: 1.05 }}
                  />
                </motion.div>
                {errors.new_password1 && (
                  <div className="invalid-feedback">
                    {errors.new_password1.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label>Confirm Password</label>
                <motion.div whileFocus={{ scale: 1.05 }}>
                  <motion.input
                    type="password"
                    className={`form-control ${
                      errors.new_password2 ? "is-invalid" : ""
                    }`}
                    {...register("new_password2")}
                    whileFocus={{ scale: 1.05 }}
                  />
                </motion.div>
                {errors.new_password2 && (
                  <div className="invalid-feedback">
                    {errors.new_password2.message}
                  </div>
                )}
              </div>

              {passwordMessage && (
                <div className="alert alert-info text-center">
                  {passwordMessage}
                </div>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-center align-items-center text-center">
              <motion.button
                type="submit"
                className="btn-blue btn-danger w-75"
                whileHover={{ scale: 1.1 }}
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordModal;
