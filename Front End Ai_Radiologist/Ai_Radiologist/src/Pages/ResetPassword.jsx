import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/Styling/Form_User.css"
import Sidebar from "../Components/Sidebar";

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [validToken, setValidToken] = useState();

    const API_URL_token = `http://127.0.0.1:8000/api/v1/auth/password/reset/confirm/${uidb64}/${token}/`;
    const API_URL_confirm = "http://127.0.0.1:8000/api/v1/auth/password/reset/confirm/";

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.post(API_URL_token, { uidb64, token });
                if (response.data.valid) {
                    setValidToken(true);
                } else {
                    setValidToken(false);
                }
            } catch (error) {
                console.error("Token verification failed:", error.response?.data || error.message);
                setValidToken(false);
            }
        };
        verifyToken();
    }, [uidb64, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(API_URL_confirm, {
                uidb64, 
                token, 
                new_password: newPassword  
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.success) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 4000);
            } else {
                setMessage("Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.detail || "An error occurred. Please try again.");
        }
    };

    if (validToken === false) {
        return (
            <div className="container mt-5">
                <h2>Invalid</h2>
                <p>This password reset link is no longer valid.</p>
                <button className="btn btn-primary" onClick={() => navigate("/forgot-password")}>
                    Request a New Link
                </button>
            </div>
        );
    }

    return (
        <div className="row m-0">
        <Sidebar/>
        <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5" >
                <h2>Reset Password</h2>
                <p>Enter your new password below.</p>

                {message && <div className="alert alert-info">{message}</div>}

                <form className="w-100" onSubmit={handleSubmit} style={{ maxWidth:"400px" ,}}>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-submit">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
