import { useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/v1/auth/password/reset/";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    //const navigate = useNavigate(); // Navigation hook

    const handleSubmit = async (e) => {
    e.preventDefault();
        setMessage("");
        setLoading(true);

    try {
        const response = await axios.post(API_URL, { email }, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("API Response:", response); // 

        if (response.status === 200) {
            setMessage("✔ Password reset email has been sent. Check your inbox.");
            

           // setTimeout(() => navigate("/login"), 5000);
        }
    } catch (error) {
        console.error("API Error:", error);
        setMessage("❌ Error occurred. Please try again later.");
        }
    finally {
        setLoading(false);
        }
};


    return (
        <div className="d-flex">
        <div className="sidebar col-lg-4 col-md-6 col-sm-12 h-100 h-md-75 h-sm-50
                d-flex flex-column align-items-center">
                    <div>
                        <h2>AI Radiologist</h2>
                        <p className="fs-5 mt-3">At Your Service For <br /> Better Health</p>
                    </div>
                </div>
        <div className="container mt-5">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <>
                            <span className="spinner-border spinner-border-sm"></span>Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                </button>
            </form>
            </div>
    </div>
    );
};
    
export default ForgotPassword; 

