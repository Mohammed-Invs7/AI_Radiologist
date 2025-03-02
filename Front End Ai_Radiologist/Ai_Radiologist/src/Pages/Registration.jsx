import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../assets/Styling/Form_User.css'
import Sidebar from "../Components/Sidebar";

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
    e.preventDefault();
    setMessage("");

    if (!isChecked) {
        setMessage("You must agree to the terms and conditions to register.");
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Server Response:", response);
        console.log("🔹 Token:", response.data.token);

        if (response.status === 201 || response.status === 200) {
            setMessage({
                text: " Registration successful! Please check your email to verify your account.",
                type: "success"
            });

            // Store token in local storage
            localStorage.setItem("username", response.data.first_name);
            localStorage.setItem("token", response.data.token);

            setTimeout(() => navigate("/login"), 5000);
        } else {
            setMessage(`❌ An unexpected error occurred. Code: ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Error Response:", error.response?.data);
        setMessage({
            text: `❌ Error: ${error.response?.data?.error || "An error occurred during registration"}`,
            type: "danger"
        });
    } finally {
        setLoading(false);
    }
};


    return (
        <div >
            <div className="row m-0">
                <Sidebar/>

                {/* Registration form */}
                <div className="col-lg-6 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50 
                d-flex flex-column align-items-center mt-3">
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

                    <form className="w-100 " style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
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
                        <div className="mt-3">
                        <Link to={"/Login"} className="login-link fw-bold">
                        Already a Member? <strong>LOG IN NOW</strong>
                    </Link>
                </div>
                </div>

                {/* Login link */}
                
            </div>
        </div>
    );
};

export default Registration;
