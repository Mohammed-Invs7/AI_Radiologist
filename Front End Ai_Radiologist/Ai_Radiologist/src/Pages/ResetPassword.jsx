import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/Styling/Form_User.css";

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    // ✅ State management
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [validToken, setValidToken] = useState(null); // null = not verified yet
    const [loading, setLoading] = useState(true); // ✅ Loading state

    // ✅ API URLs
    const API_URL_TOKEN = `http://127.0.0.1:8000/api/v1/auth/password/reset/confirm/${uidb64}/${token}/`;
    const API_URL_CONFIRM = "http://127.0.0.1:8000/api/v1/auth/password/reset/confirm/";

    // ✅ Verify token when the page loads
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.post(API_URL_TOKEN, { uidb64, token });
                setValidToken(response.data.valid); // ✅ Confirm token validity
            } catch (error) {
                console.error("Token verification failed:", error.response?.data || error.message);
                setValidToken(false); // ❌ Invalid token
            } finally {
                setLoading(false); // ⏳ End loading
            }
        };

        verifyToken();
    }, [uidb64, token]);

    // ✅ If the token is not valid
    if (loading) {
        return <div className="container mt-5"><h2>Verifying...</h2></div>;
    }

    if (validToken === false) {
        return (
            <div className="container mt-5 text-center">
                <h2>Invalid Link</h2>
                <p>This link may be expired or invalid.</p>
                <button className="btn btn-primary" onClick={() => navigate("/forgot-password")}>
                    Request a New Link
                </button>
            </div>
        );
    }

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("❌ The passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(API_URL_CONFIRM, {
                uidb64,
                token,
                new_password: newPassword
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.success) {
                setMessage("✅ Password reset successfully! You can now log in.");
            } else {
                setMessage("❌ Failed to reset. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.detail || "❌ An error occurred while resetting. Please try again.");
        }
    };

    return (
        <div className="row m-0">
            <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5">
                <h2>Reset Password</h2>
                <p>Please enter your new password</p>

                {message && <div className="alert alert-info">{message}</div>}

                <form className="w-100" onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
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

                {message.includes("Password reset successfully") && (
                    <button className="btn btn-success mt-3" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
