import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Img1 from '../../../assets/WhatsApp Image 2024-12-06 at 9.21.37 AM 3.png';

//const API_URL = "http://localhost:5000"; // Backend server URL

const Login = () => {
    const navigate = useNavigate(); // Using useNavigate
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState(""); // State to store error or success message

    // Update input fields when user enters data
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   // Send login data to the server
// const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     setMessage(""); // Clear previous message

//     try {
//         const response = await axios.post(`${API_URL}/login`, formData, {
//             headers: { "Content-Type": "application/json" }
//         });

//         // Check if request is successful using response.status
//         if (response.status === 200) {
//             setMessage("✅ Login successful! Redirecting...");

//             // Save user data in localStorage after login
//             localStorage.setItem("user", JSON.stringify({ 
//                 username: response.data.username, 
//                 profilePic: response.data.profilePic // Save user's profile picture
//             }));

//             // If there is a `token`, save it as well
//             if (response.data.token) {
//                 localStorage.setItem("token", response.data.token);
//             }

//             // Correct `setTimeout` and redirect to the home page
//             setTimeout(() => navigate("/"), 2000);
//         } else {
//             setMessage(`❌ An unexpected error occurred. Code: ${response.status}`);
//         }
//     } catch (error) {
//         setMessage(`❌ Error: ${error.response?.data?.error || "Login failed. Please try again."}`);
//         console.error("❌ Error:", error);
//     }
// };
    
    const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setMessage(""); // Clear previous message

    try {
        // Simulate response without API
        const fakeApiResponse = {
            username: "Ali  Shamlan",
            profilePic: Img1,
            token: "fake-jwt-token-123456"
        };

        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify({
            username: fakeApiResponse.username,
            profilePic: fakeApiResponse.profilePic
        }));

        localStorage.setItem("token", fakeApiResponse.token);

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);

    } catch (err) {
        setMessage(`Error: ${err.message}. Please try again.`);
    }
};


    return (
        <div className="row m-0">
            <div className="sidebar col-lg-4 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50
                d-flex flex-column align-items-center">
                <div>
                    <h2>AI Radiologist</h2>
                    <p className="fs-5 mt-3">At Your Service For <br /> Better Health</p>
                </div>
            </div>

            {/* Login section */}
            <div className="col-lg-6 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50 
                d-flex flex-column align-items-center mt-5">
                <div className="w-100 text-center m-3">
                    <h3 className="fw-bold">WELCOME BACK</h3>
                    <p>Log in to your account</p>
                </div>

                {/* Show success or error message */}
                {message && <div className="alert alert-info">{message}</div>}

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

                    <button type="submit" className="btn btn-login">
                        Log In
                    </button>
                </form>

                {/* Additional links */}
                <div className="text-links">
                    <a href="/forgot-password">Forgot Password?</a>
                    <br />
                    <a href="/Registration">Do not have an account? <strong>Registration</strong></a>
                </div>
            </div>
        </div>
    );
};

export default Login;
