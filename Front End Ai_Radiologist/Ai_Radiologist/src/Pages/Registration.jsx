//Importing Libraries//
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import zxcvbn from "zxcvbn";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import "../assets/Styling/Form_User.css";
import Sidebar from "../Components/Sidebar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";
//Importing Libraries//

//Defining Constants and Schema//
const API_URL = `${BASE_URL}/auth/registration/`;
const CHECK_EMAIL_URL = `${BASE_URL}/auth/check-email/`;

const schema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "First name must contain letters only"),

  last_name: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Last name must contain letters only"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Min 8 characters")
    .test("strong-password", "Password is too weak", (value) => {
      const result = zxcvbn(value || "");
      return result.score >= 3;
    }),

  password_confirm: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),

  date_of_birth: yup.string().required("Date of birth is required"),

  gender: yup.string().required("Gender is required"),
});
//Defining Constants and Schema//

const Registration = () => {
  //State and useForm Hook Setup//
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  if (token) {
    return <Navigate to="/" />;
  }

  const passwordValue = watch("password");
  const passwordStrength = zxcvbn(passwordValue || "");

  //State and useForm Hook Setup//

  const handleEmailBlur = async () => {
    const email = watch("email");

    if (!email) return;

    setEmailStatus("checking");
    try {
      const res = await axios.get(`${CHECK_EMAIL_URL}${email}/`);
      if (res.data.exists) {
        setEmailStatus("exists");
        setError("email", {
          type: "manual",
          message:
            "This email is already registered. Please use a different one.",
        });
      } else {
        setEmailStatus("available");
        clearErrors("email");
      }
    } catch {
      setEmailStatus("");
    }
  };

  const onSubmit = async (data) => {
    setServerError("");

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user_fullname",
          `${response.data.first_name} ${response.data.last_name}`
        );

        Swal.fire({
          title: "Registration Successful!",
          text: "Please check your email to confirm your account.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/login"));
      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.email?.length > 0) {
        setError("email", {
          type: "server",
          message:
            "This email is already in use. Please use a different email.",
        });
        setEmailStatus("exists");
      } else {
        setServerError("Something went wrong. Please try again.");
      }

      Swal.fire({
        title: "Error!",
        text: serverError || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleBlur = (fieldName) => {
    trigger(fieldName);
  };

  return (
    <div className="page-form">
      <div className="container-form">
        <div className="form-box registration">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Registration</h1>

            {/* First Name */}
            <div className="input-box">
              <i className="bx bx-user"></i>
              <input
                type="text"
                placeholder="First Name"
                {...register("first_name")}
                className={`form-control ${
                  errors.first_name ? "is-invalid" : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.first_name?.message}
                onBlur={() => handleBlur("first_name")}
              />
            </div>

            {/* Last Name */}
            <div className="input-box">
              <i className="bx bx-user"></i>
              <input
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
                className={`form-control ${
                  errors.last_name ? "is-invalid" : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.last_name?.message}
                onBlur={() => handleBlur("last_name")}
              />
            </div>

            {/* Email */}
            <div className="input-box">
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : emailStatus === "available"
                    ? "is-valid"
                    : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.email?.message}
                onBlur={() => {
                  handleEmailBlur();
                  handleBlur("email");
                }}
              />
            </div>

            {/* Password */}
            <div className="input-box">
              <i className="bx bx-lock"></i>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={`form-control password ${
                  errors.password ? "is-invalid" : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={
                  errors.password?.message ||
                  (passwordValue && passwordStrength.score < 3
                    ? "Password is too weak"
                    : "")
                }
                onBlur={() => handleBlur("password")}
              />
            </div>

            {/* Confirm Password */}
            <div className="input-box">
              <i className="bx bx-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("password_confirm")}
                className={`form-control password ${
                  errors.password_confirm ? "is-invalid" : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.password_confirm?.message}
                onBlur={() => handleBlur("password_confirm")}
              />
            </div>

            {/* Date of Birth */}
            <div className="input-box">
              <input
                type="date"
                {...register("date_of_birth")}
                className={`form-control date_of_birth ${
                  errors.date_of_birth ? "is-invalid" : ""
                }`}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.date_of_birth?.message}
                onBlur={() => handleBlur("date_of_birth")}
              />
            </div>

            {/* Gender */}
            <div className="mb-3 text-start">
              <label className="form-label">Gender</label>
              <div className="d-flex">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    value="M"
                    {...register("gender")}
                    className={`form-check-input ${
                      errors.gender ? "is-invalid" : ""
                    }`}
                    id="male"
                    data-tooltip-id="form-tooltip"
                    data-tooltip-content={errors.gender?.message}
                    onBlur={() => handleBlur("gender")}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    value="F"
                    {...register("gender")}
                    className={`form-check-input ${
                      errors.gender ? "is-invalid" : ""
                    }`}
                    id="female"
                    data-tooltip-id="form-tooltip"
                    data-tooltip-content={errors.gender?.message}
                    onBlur={() => handleBlur("gender")}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-blue" disabled={isSubmitting}>
              {isSubmitting ? "Register" : "Register"}
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </form>
        </div>

        <Tooltip id="form-tooltip" place="right" />
        <Sidebar />
      </div>
    </div>
  );
};

export default Registration;
