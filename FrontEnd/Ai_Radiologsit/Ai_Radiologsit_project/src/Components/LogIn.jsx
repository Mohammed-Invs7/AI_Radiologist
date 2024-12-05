import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = () => {
    return (
        <div className="container-fluid vh-100 d-flex">
            {/* Sidebar */}
            <div style={{ background: 'linear-gradient(180deg, #24243E 0%, #2C9E84 50%, #0F0C29 100%)' }}
                className="col-md-5 text-white d-flex flex-column justify-content-center align-items-center">
                <h2 className="fw-bold">X-ray Interpret</h2>
                <p className="fs-5 mt-3 text-center">
                    At Your Service For Better Health
                </p>
            </div>

            {/* Login Form Section */}
            <div className="col-md-7 d-flex flex-column justify-content-center align-items-center px-5">
                <div className="w-100 text-center mb-4">
                    <h3 className="fw-bold">WELCOME BACK</h3>
                    <p>Log in to your account</p>
                </div>

                {/* Login Form */}
                <form className="w-100" style={{ maxWidth: "400px" }}>
                    {/* Email Field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                        </span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button style={{ background: '#2C9E84' }}
                        type="submit"
                        className="btn w-100 fw-bold text-white"
                    >
                        Log In
                    </button>
                </form>

                {/* Additional Links */}
                <div className="text-center mt-4">
                    <a
                        href="/forgot-password"
                        className="d-block text-decoration-none text-secondary"
                    >
                        Forgot Password?
                    </a>
                    <a
                        href="/SingIn"
                        className="d-block text-decoration-none text-success mt-2"
                    >
                        Don't have an account? <strong>Sign Up</strong>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
