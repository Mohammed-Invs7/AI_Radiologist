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
        <div className="page-form">
            <div className="container-form">
            {/* Login Form Section */}
                <div className="form-box login flex-column ">
                

                {/* Display error message if exists */}
                {message && <div className="alert alert-danger">{message}</div>}

                <form action={{}} onSubmit={handleSubmit}>
                    <h3 className="fw-bold">Login</h3>
                    <p>Log in to your account</p>
                    {/* Email Input */}
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

                    {/* Password Input */}
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
                        <div className="forget-link">
                            Forgot Password?
                        </div>
                    </Link>

                    {/* Login Button */}
                    <button type="submit" className="btn btn-submit">
                        Log In
                    </button>
                </form>

                </div>
                <Sidebar/>
            </div>
        </div>
    );
};

export default Login;
