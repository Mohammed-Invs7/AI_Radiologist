import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext"; // Import authentication context
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://127.0.0.1:8000/api/v1/auth/login/"; // Backend API URL

const Login = () => {
    const { login } = useAuth(); // Get login function from AuthContext
    const navigate = useNavigate(); // Navigation hook

    const [formData, setFormData] = useState({ email: "", password: "" }); // State for login form inputs
    const [message, setMessage] = useState(""); // State for displaying login messages

    // Handle input changes and update form data state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setMessage(""); // Reset previous messages

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.access) {
                login(response.data.access); // Update authentication state in AuthContext
                localStorage.setItem("refreshToken", response.data.refresh); // Store refresh token in localStorage
                navigate('/Upload_Page'); // Redirect to upload page after successful login
            } else {
                setMessage("❌ Token is missing in the response!");
            }
        } catch {
            setMessage("Login failed! Please check your credentials."); // Display error message
        }
    };

    return (
        <div className="row m-0">
            {/* Sidebar */}
            <div className="sidebar col-lg-4 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50
                d-flex flex-column align-items-center">
                    <div>
                        <h2>AI Radiologist</h2>
                        <p className="fs-5 mt-3">At Your Service For <br /> Better Health</p>
                    </div>
                </div>

            {/* Login Form */}
            <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5">
                <h3 className="fw-bold">WELCOME BACK</h3>
                <p>Log in to your account</p>

                {/* Display error message */}
                {message && <div className="alert alert-danger">{message}</div>}

                {/* Login form */}
                <form className="w-100" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                    {/* Email input field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password input field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Login button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Log In
                    </button>
                </form>

                {/* Additional links */}
                <div className="text-links mt-3">
                    <a href="/forgot-password">Forgot Password?</a>
                    <br />
                    <a href="/Registration">Do not have an account? <strong>Register</strong></a>
                </div>
            </div>
        </div>
    );
};

export default Login;
