import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Components/Sidebar";
import "../assets/Styling/Form_User.css";

// API Endpoints
const API_LOGIN = "http://127.0.0.1:8000/api/v1/auth/login/";
const API_USERS = "http://127.0.0.1:8000/api/v1/auth/user/";

// Yup validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setMessage(""); // Reset message before making API call

        try {
            const response = await axios.post(API_LOGIN, data, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.access) {
                const token = response.data.access;
                const refreshToken = response.data.refresh;

                const userResponse = await axios.get(API_USERS, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                console.log(userResponse.data);

                let userData = userResponse.data;

                let userType = "";
                if (userData.user_type === 1) {
                    userType = "admin";
                } else if (userData.user_type === 2) {
                    userType = "user";
                } else {
                    userType = "unknown";
                }

                userData.user_type = userType;

                login(token, userData);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(userData));

                if (userType === "admin") {
                    navigate('/AdminPanel');
                } else if (userType === "user") {
                    navigate('/Upload');
                } else {
                    setMessage("Unknown user type!");
                }
            } else {
                setMessage("Token is missing in the response!");
            }
        } catch (error) {
            console.error("Login Failed:", error.response?.data || error.message);
            setMessage("Login failed! Please check your credentials.");
        }
    };

    return (
        <div className="page-form">
            <div className="container-form">
                <div className="form-box login flex-column">
                    {message && <div className="alert alert-danger">{message}</div>}
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
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
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
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            <i className="bx bx-lock-alt"></i>
                        </div>

                        <Link to="/forgot-password" className="forget-link">
                            <div className="forget-link">Forgot Password?</div>
                        </Link>

                        <button type="submit" className="btn btn-submit">Log In</button>
                    </form>
                </div>
                <Sidebar />
            </div>
        </div>
    );
};

export default Login;
