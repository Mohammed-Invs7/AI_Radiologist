import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "../assets/Styling/Form_User.css";

// API endpoint
const API_URL = "http://127.0.0.1:8000/api/v1/auth/password/reset/";

// Yup validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSubmitForm = async (data) => {
        setMessage("");  // Reset the message
        setLoading(true);

        try {
        const response = await axios.post(API_URL, { email: data.email }, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("API Response:", response);

        if (response.status === 200) {
            setMessage("✔ Password reset email has been sent. Check your inbox.");
        }
        } catch (error) {
        console.error("API Error:", error);
        setMessage("Error occurred. Please try again later.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="page-form">
        <div className="container-form d-flex flex-column justify-content-center align-items-center">
            <div className="text-center">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>

            {message && <div style={{ width: "90%" }} className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit(handleSubmitForm)} style={{ maxWidth: "400px" }}>
                <div className="input-box">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    {...register("email")}
                />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? (
                    <>
                    <span className="spinner-border spinner-border-sm"></span> Sending...
                    </>
                ) : (
                    "Send Reset Link"
                )}
                </button>
            </form>
            </div>
        </div>
        </div>
    );
    };

export default ForgotPassword;
