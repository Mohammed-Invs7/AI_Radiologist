import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Components/Sidebar";
import "../assets/Styling/Form_User.css";

const API_URL = "http://127.0.0.1:8000/api/v1/auth/login/";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" }); 
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.access) {
                const token = response.data.access;
                const refreshToken = response.data.refresh;

                console.log("Received Token:", token);

                // Fetch user data after login
                const userResponse = await axios.get("http://127.0.0.1:8000/api/v1/auth/user/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                let userData = userResponse.data;
                console.log("User Data Fetched:", userData);

                if (userData.pk === 1) {
                    userData.user_type = "admin";
                } else if (userData.pk === 2) {
                    userData.user_type = "user";
                }

                console.log("User Type:", userData.user_type);

                login(token, userData);
                localStorage.setItem("refreshToken", refreshToken);
                
                // Redirect based on user type
                if (userData.user_type === "admin") {
                    navigate('/AdminDashboard'); // Redirect admins to the admin panel
                } else {
                    navigate('/Upload'); // Redirect normal users
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
                    <form onSubmit={handleSubmit}>
                        <h3>Login</h3>
                        <p>Log in to your account</p>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <i className="bx bx-envelope"></i>
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <i className="bx bx-lock-alt"></i>
                        </div>

                        <Link to="/forgot-password" className="forget-link">
                            <div className="forget-link">Forgot Password?</div>
                        </Link>

                        <button type="submit" className="btn btn-submit">Log In</button>
                    </form>
                </div>
                <Sidebar/>
            </div>
        </div>
    );
};

export default Login;
