import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Components/Sidebar";
import "../assets/Styling/Form_User.css";

// API Endpoints
const API_LOGIN = "http://127.0.0.1:8000/api/v1/auth/login/";
const API_USERS = "http://127.0.0.1:8000/api/v1/auth/user/";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { token, login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (loading) return null;

  if (token) {
    return <Navigate to="/" />;
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

        if (userType === "admin") {
          navigate("/AdminPanel");
        } else if (userType === "user") {
          navigate("/Upload");
        } else {
          Swal.fire({
            icon: "error",
            title: "Unknown User Type",
            text: "Your account type is not recognized.",
          });
        }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Login</h3>
            <p>Log in to your account</p>

            <div className="input-box">
              <input
                type="email"
                name="email"
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
                name="password"
                placeholder="Password"
                className="form-control"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
              <i className="bx bx-lock-alt"></i>
            </div>

            <Link to="/forgot-password" className="forget-link">
              <div className="forget-link">Forgot Password?</div>
            </Link>

            <button type="submit" className="btn-blue btn-submit">
              Log In
            </button>
          </form>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default Login;
