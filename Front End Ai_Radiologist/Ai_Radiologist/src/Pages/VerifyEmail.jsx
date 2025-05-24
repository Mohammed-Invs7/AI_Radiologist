import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Styling/Form_User.css";

const API_VERIFY_URL =
  "http://127.0.0.1:8000/api/v1/auth/registration/verify-email/";

export default function VerifyEmail() {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate();

  const [message, setMessage] = useState("🔄 Verifying your email...");
  const [success, setSuccess] = useState(null); // Manage success or failure state
  const [loading, setLoading] = useState(true); // ✅ Add a loading state

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("❌ Invalid verification link.");
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          API_VERIFY_URL,
          { key: token }, // Send the token correctly
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          setMessage("✅ Email verified successfully! You can now log in.");
          setSuccess(true);
          setTimeout(() => navigate("/login"), 5000); // Redirect after 5 seconds
        } else {
          setMessage("❌ Verification failed. The link is invalid or expired.");
          setSuccess(false);
        }
      } catch (error) {
        console.error(
          "Error verifying email:",
          error.response?.data || error.message
        );
        setMessage(
          "❌ An error occurred during verification. Please try again."
        );
        setSuccess(false);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="row m-0">
      <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5">
        <h2>Email Verification</h2>

        {/* ✅ Show loading state */}
        {loading ? (
          <p className="alert alert-info">⏳ Verifying your email...</p>
        ) : (
          <p className={`alert ${success ? "alert-success" : "alert-danger"}`}>
            {message}
          </p>
        )}

        {/* ✅ Improve user experience on failure */}
        {!loading && !success && (
          <button
            className="btn-blue btn-primary mt-3"
            onClick={() => navigate("/Registration")}
          >
            Register Again
          </button>
        )}

        {/* ✅ Improve redirection on success */}
        {!loading && success && (
          <button
            className="btn-blue btn-success mt-3"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
