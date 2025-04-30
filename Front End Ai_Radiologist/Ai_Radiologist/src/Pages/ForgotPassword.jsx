import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/Styling/Form_User.css";
 import { BASE_URL } from "../config";


// API endpoint
const API_PASS_RESET = `${BASE_URL}/auth/password/reset/`;

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        API_PASS_RESET,
        { email: data.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: "Password reset email has been sent. Check your inbox.",
        });
        reset(); // Clear form
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.detail || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-form">
      <div className="container-form d-flex flex-column justify-content-center align-items-center">
        <div className="text-center">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset link.</p>

          <form onSubmit={handleSubmit(handleSubmitForm)} style={{ maxWidth: "400px" }}>
            <div className="input-box mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <button type="submit" className="btn-blue btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
