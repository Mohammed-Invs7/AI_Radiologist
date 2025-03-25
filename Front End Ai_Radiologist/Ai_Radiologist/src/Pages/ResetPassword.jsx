import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/Styling/Form_User.css";

const ResetPassword = () => {
    const { uid, token } = useParams(); 
    const navigate = useNavigate();

    // State management
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);   

    // API URL
    const API_URL_CONFIRM = "http://127.0.0.1:8000/api/v1/auth/password/reset/confirm/";

    // Verify token when the page loads (removed as it is not necessary now)
    useEffect(() => {
        console.log("Received UID:", uid);
        console.log("Received Token:", token);
        setLoading(false);  // set loading to false directly since we are not verifying the token here
    }, [uid, token]);

    if (loading) {
        return <div className="container mt-5"><h2>Verifying...</h2></div>;
    }

  // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        console.log("Submitting new password...");
        console.log("UID:", uid);
        console.log("Token:", token);
        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);

        if (newPassword !== confirmPassword) {
            setMessage("The passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(API_URL_CONFIRM, {
                uid: uid,  
                token: token,
                new_password1: newPassword,
                new_password2: confirmPassword,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Password reset response:", response.data);

            // Check if the response contains the 'detail' field indicating success
            if (response.data.detail) {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 4000);
            } else {
                setMessage("Failed to reset. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.detail || "An error occurred while resetting. Please try again.");
        }
    };

    return (
        <div className="page-form">
            <div className="container-form d-flex flex-column justify-content-center align-items-center" >
                <div className="w-50">
                <h2>Reset Password</h2>
                <p>Please enter your new password</p>

                {message && <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>{message}</div>}

                <form className="w-100" onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
                    <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <div className="input-box">
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                />
                            <div className=" mt-3 ">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            </div>
                        </div>

                    
                        </div>
                        

                    <button type="submit" className="btn btn-submit">
                        Reset Password
                    </button>
                </form>

                {message.includes("Password reset successfully") && (
                    <button style={{display:"none"}} className="btn btn-success mt-3" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                )}
            </div>
            </div>
            </div>
    );
};

export default ResetPassword;
