import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import "../assets/Styling/Form_User.css";
 import { BASE_URL } from "../config";

 const API_RESET_PASS = `${BASE_URL}/auth/password/reset/confirm/`;

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setLoading(false);
  }, [uid, token]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Verifying...</h2>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_RESET_PASS}`,
        {
          uid: uid,
          token: token,
          new_password1: data.newPassword,
          new_password2: data.confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.detail) {
        Swal.fire({
          icon: "success",
          title: "Password reset successfully!",
          text: "You will be redirected to login...",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/login"), 4000);
      } else {
        Swal.fire(
          "Error",
          "Failed to reset password. Please try again.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.detail || "An error occurred",
        "error"
      );
    }
  };

  return (
    <div className="page-form">
      <div className="container-form d-flex flex-column justify-content-center align-items-center">
        <div className="w-50">
          <h2>Reset Password</h2>
          <p>Please enter your new password</p>

          <form
            className="w-100"
            onSubmit={handleSubmit(onSubmit)}
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.newPassword ? "is-invalid" : ""
                }`}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <div className="invalid-feedback">
                  {errors.newPassword.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            <button type="submit" className="btn-blue btn-submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
