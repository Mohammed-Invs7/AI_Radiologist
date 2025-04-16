import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import "../assets/Styling/Form_User.css";
import Sidebar from "../Components/Sidebar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const API_URL = "http://127.0.0.1:8000/api/v1/auth/registration/";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, " Min 8 characters").required(),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("confirm your password"),
  date_of_birth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
});

const Registration = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", `${response.data.first_name} ${response.data.last_name}`);
        
        Swal.fire({
  title: 'Registration Successful!',
  text: 'Please check your email to confirm your account.',
  icon: 'success',
  confirmButtonText: 'OK',
            }).then(() => {
            navigate("/login");
            });

      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.email?.length > 0) {
        setError("email", {
          type: "server",
          message: "This email is already in use. Please use a different email.",
        });
      } else {
        setServerError("Something went wrong. Please try again.");
      }

      Swal.fire({
        title: 'Error!',
        text: serverError || "Something went wrong. Please try again.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
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
                className={errors.first_name ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.first_name?.message}
              />
            </div>

            {/* Last Name */}
            <div className="input-box">
              <i className="bx bx-user"></i>
              <input
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
                className={errors.last_name ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.last_name?.message}
              />
            </div>

            {/* Email */}
            <div className="input-box">
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={errors.email ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.email?.message}
              />
            </div>

            {/* Password */}
            <div className="input-box">
              <i className="bx bx-lock"></i>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={errors.password ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.password?.message}
              />
            </div>

            {/* Confirm Password */}
            <div className="input-box">
              <i className="bx bx-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("password_confirm")}
                className={errors.password_confirm ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.password_confirm?.message}
              />
            </div>

            {/* Date of Birth */}
            <div className="input-box">
              <i className="bx bx-calendar"></i>
              <input
                type="date"
                {...register("date_of_birth")}
                className={errors.date_of_birth ? "is-invalid" : "form-control"}
                data-tooltip-id="form-tooltip"
                data-tooltip-content={errors.date_of_birth?.message}
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
                    className="form-check-input"
                    id="male"
                  />
                  <label className="form-check-label" htmlFor="male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    value="F"
                    {...register("gender")}
                    className="form-check-input"
                    id="female"
                  />
                  <label className="form-check-label" htmlFor="female">Female</label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register"}
              {isSubmitting && <span className="spinner-border spinner-border-sm ms-2" />}
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
