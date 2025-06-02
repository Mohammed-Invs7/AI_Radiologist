import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Components/Sidebar";
import "../assets/Styling/Form_User.css";
import { BASE_URL } from "../config";

// API Endpoints
const API_LOGIN = `${BASE_URL}/auth/login/`;
const API_USERS = `${BASE_URL}/auth/user/`;

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { token, user, login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (loading) return null;
  if (token && user) {
    if (user.user_type === "admin") {
      return <Navigate to="/AI_Radiologist/AdminPanel" />;
    } else if (user.user_type === "user") {
      return <Navigate to="/AI_Radiologist" />;
    } else {
      return null;
    }
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_LOGIN, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.access) {
        const token = response.data.access;
        const refreshToken = response.data.refresh;

        const userResponse = await axios.get(API_USERS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userData = userResponse.data;
        let userType =
          userData.user_type === 1
            ? "admin"
            : userData.user_type === 2
            ? "user"
            : "";
        userData.user_type = userType;

        await login(token, userData, refreshToken);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Token is missing in the response!",
        });
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials.",
      });
    }
  };

  return (
    <div className="page-form">
      <div className="container-form">
        <div className="form-box login flex-column">
          <form className="form-r-l" onSubmit={handleSubmit(onSubmit)}>
            <h3>Login</h3>
            <p>Log in to your account</p>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
              <i className="bx bx-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
              <i className="bx bx-lock-alt"></i>
            </div>

            <Link to="/AI_Radiologist/forgot-password" className="forget-link">
              <div className="forget-link">Forgot Password?</div>
            </Link>

            <button type="submit" className="btn-blue" disabled={isSubmitting}>
              {isSubmitting ? "Login" : "Login"}
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </form>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default Login;
