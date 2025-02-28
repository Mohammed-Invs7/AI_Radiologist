import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import navigation functions
import axios from "axios"; // Import Axios for API requests
import { useAuth } from "../context/AuthContext"; // Import AuthContext for authentication state
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling
import Sidebar from "../Components/Sidebar";
import "../assets/Styling/Form_User.css"

const API_URL = "http://127.0.0.1:8000/api/v1/auth/login/"; // API endpoint for user authentication

const Login = () => {
    const { login } = useAuth(); // Get login function from AuthContext
    const navigate = useNavigate(); // Initialize navigation function

    // Initialize form data state
    const [formData, setFormData] = useState({ email: "", password: "" }); 
    const [message, setMessage] = useState(""); // State for error/success messages

    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setMessage(""); // Clear previous messages

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.access) { // Check if access token is received
                const token = response.data.access;
                const refreshToken = response.data.refresh;

                console.log("Received Token:", token); // Log token in the console

                // Fetch user data after login
                const userResponse = await axios.get("http://127.0.0.1:8000/api/v1/auth/user/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const userData = userResponse.data;
                console.log("User Data Fetched:", userData); // Log user data

                // Store data in AuthContext and localStorage
                login(token, userData);
                localStorage.setItem("refreshToken", refreshToken); // Store refresh token
                
                navigate('/Upload'); // Redirect after successful login
            } else {
                setMessage("Token is missing in the response!");
            }
        } catch (error) {
            console.error("Login Failed:", error.response?.data || error.message);
            setMessage("Login failed! Please check your credentials."); // Display error message
        }
    };

    return (
        <div className="row m-0">
        <Sidebar/>

            {/* Login Form Section */}
            <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5">
                <h3 className="fw-bold">WELCOME BACK</h3>
                <p>Log in to your account</p>

                {/* Display error message if exists */}
                {message && <div className="alert alert-danger">{message}</div>}

                <form className="w-100" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                    {/* Email Input */}
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

                    {/* Password Input */}
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

                    {/* Login Button */}
                    <button type="submit" className="btn btn-submit">
                        Log In
                    </button>
                </form>

                {/* Additional Links */}
                <div className="text-links mt-3 text-center w-100 fw-bold">
                    <p > <Link to="/forgot-password" className="login-link">Forgot Password?</Link></p>
                    <Link to="/Registration" className="login-link">Do not have an account? <strong>Register</strong></Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
