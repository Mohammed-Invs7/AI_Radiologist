import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Registration.css'

// Backend server URL
const API_URL = "http://127.0.0.1:8000/api/v1/auth/registration/"; 

const Registration = () => {
    // Store user data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirm:"",
        date_of_birth: "",
        gender: ""
    });

    const [message, setMessage] = useState(""); // Store validation or success messages
    const [loading, setLoading] = useState(false);  // Loading state
    const [isChecked, setIsChecked] = useState(false); // Track terms and conditions agreement
    const navigate = useNavigate(); // Navigation hook

    // Update values when user inputs data
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit data when the register button is clicked
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setMessage(""); // Reset message

        // Validate email format
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!isValidEmail) {
            setMessage("Please enter a valid email address.");
            return;
        }
        
        // Validate password strength
        const isPasswordStrong = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(formData.password);
        if (!isPasswordStrong) {
            setMessage("Password must contain at least 8 characters, including a lowercase letter, an uppercase letter, a number, and a special character.");
            return;
        }

        // Validate password and confirm password match
        if (formData.password !== formData.password_confirm) {
            setMessage("Passwords do not match!");
            return;
        }

        // Validate age (18+)
        const today = new Date();
        const birthDay = new Date(formData.date_of_birth);
        const age = today.getFullYear() - birthDay.getFullYear();
        const month = today.getMonth() - birthDay.getMonth();
        if (age < 18 || (age === 18 && month < 0)) {
            setMessage("You must be at least 18 years old to register.");
            return;
        }

        // Ensure the user agrees to the terms
        if (!isChecked) {
            setMessage("You must agree to the terms and conditions to register.");
            return;
        }

        
        setLoading(true); // Start loading

        try {
            const response = await axios.post(API_URL, formData);

            if (response.status === 201 || response.status === 200) {  
                console.log("Server Response:", response);
                setMessage({
                    text: " Registration successful! Please check your email to verify your account.",
                    type: "success" 
                });
                localStorage.setItem("username", response.data.first_name); // Save the new username
                //setTimeout(() => navigate("/login"), 5000); // Redirect after success
            } else {
                setMessage(`❌ An unexpected error occurred. Code: ${response.status}`);
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.error || "An error occurred during registration"}`);
        } finally {
            setLoading(false); // Stop loading
        } 
    };

    return (
        <div>
            <div className="row m-0">
                {/* Sidebar */}
                <div className="sidebar col-lg-4 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50
                d-flex flex-column align-items-center">
                    <div>
                        <h2>AI Radiologist</h2>
                        <p className="fs-5 mt-3">At Your Service For <br /> Better Health</p>
                    </div>
                </div>

                {/* Registration form */}
                <div className="col-lg-6 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50 
                d-flex flex-column align-items-center mt-5">
                    <div className="w-100 text-center m-3">
                        <h3 className="fw-bold">WELCOME</h3>
                    </div>

                    {/* Display success or error message */}
                    {message.text && (
                        <div className={`alert alert-${message.type} text-center fw-bold`} role="alert">
                            {message.text}
                        </div>
                    )}

                    {/* Show loading spinner */}
                    {loading && <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}

                    <form className="w-100" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                        {/* Input fields */}
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" name="first_name" placeholder="First Name" className="form-control"
                                value={formData.first_name} onChange={handleChange} required />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" name="last_name" placeholder="Last Name" className="form-control"
                                value={formData.last_name} onChange={handleChange} required />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input type="email" name="email" placeholder="Email" className="form-control"
                                value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input type="password" name="password" placeholder="Password" className="form-control"
                                value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input type="password" name="password_confirm" placeholder="Confirm Password" className="form-control"
                                value={formData.password_confirm} onChange={handleChange} required />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                            <input type="date" name="date_of_birth" className="form-control"
                                value={formData.date_of_birth} onChange={handleChange} required />
                        </div>

                        {/* Gender selection */}
                        <div className="mb-3">
                            <label className="form-label d-block">Gender</label>
                            <div className="d-flex">
                                <div className="form-check form-check-inline">
                                    <input type="radio" name="gender" value="M" className="form-check-input"
                                        checked={formData.gender === "M"} onChange={handleChange} required />
                                    <label className="form-check-label">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" name="gender" value="F" className="form-check-input"
                                        checked={formData.gender === "F"} onChange={handleChange} required />
                                    <label className="form-check-label">Female</label>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="terms"
                                checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                            <label className="form-check-label" htmlFor="terms">
                                I agree to the <a href="/terms">terms and conditions</a>.
                            </label>
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="btn btn-submit">
                            Become a Member →
                        </button>
                    </form>

                </div>

                {/* Login link */}
                <div className="col-lg-2 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50 mt-2">
                    <a href="/Login" className="login-link">
                        Already a Member? <strong>LOG IN NOW</strong>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Registration;
