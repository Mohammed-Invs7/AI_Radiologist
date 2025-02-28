import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Styling/Form_User.css"
import Sidebar from "../Components/Sidebar";

const API_VERIFY_URL = "http://127.0.0.1:8000/api/v1/auth/registration/verify-email/";

export default function VerifyEmail() {
    const { token } = useParams(); // Extract the token from the URL
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            console.log("Token being sent:", token); // Debugging token in console

            try {
                const response = await axios.post(
                    API_VERIFY_URL,
                    { key: token },  // Send the token using the expected key
                    { headers: { "Content-Type": "application/json" } }
                );

                console.log("Server Response:", response.data); // Debugging response

                if (response.status === 200) {
                    setMessage("✅ Email verified successfully! Redirecting to login...");
                    setTimeout(() => navigate("/login"), 5000); // Redirect to login after 4 seconds
                } else {
                    setMessage("❌ Verification failed. Invalid or expired token.");
                }
            } catch (error) {
                console.error("Error fetching data:", error.response?.data);
                setMessage("❌ Error verifying email. Please try again.");
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage("❌ Invalid verification link.");
        }
    }, [token, navigate]);

    return (
        <div className="row m-0">
        <Sidebar/>
        <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center mt-5" >
            <h2>Email Verification</h2>
            <p className="alert alert-info">{message}</p>
        </div>
        </div>
    );
}
