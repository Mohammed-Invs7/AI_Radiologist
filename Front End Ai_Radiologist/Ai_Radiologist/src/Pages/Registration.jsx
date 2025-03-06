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
    // const [isChecked, setIsChecked] = useState(false); // Track terms and conditions agreement
    const navigate = useNavigate(); // Navigation hook

    // Update values when user inputs data
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit data when the register button is clicked
    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // if (!isChecked) {
    //     setMessage("You must agree to the terms and conditions to register.");
    //     return;
    // }

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
        <div className="page-form">
            <div className="container-form" >
                    

                    {/* Registration form */}
                    <div className="form-box registration">
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

                    <form action={{}} onSubmit={handleSubmit}>
                        <h1>Registration</h1>
                        {/* Input fields */}
                            <div className="input-box" >
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                                <i className="bx bx-user"></i>

                            </div>

                            <div className="input-box" >
                            <input type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                                <i className="bx bx-user"></i>
                            </div>

                            <div className="input-box" >
                            <input type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <i className="bx bx-envelope"></i>

                            </div>

                            <div className="input-box" >
                            <input type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <i className="bx bx-lock-alt"></i>

                            </div>

                            <div className="input-box" >
                            <input type="password"
                                name="password_confirm"
                                placeholder="Confirm Password"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                            />
                                <i className="bx bx-lock-alt"></i>

                            </div>

                            <div className="input-box" >
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                required />
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
                            

                            {/* Submit button */}
                            <button type="submit" className="btn">
                                Become a Member →
                            </button>
                        </form>
                            {/* Login link */}
                            {/* <div className="mt-3">
                            <Link to={"/Login"} className="login-link fw-bold">
                            Already a Member? <strong>LOG IN NOW</strong>
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Registration;
