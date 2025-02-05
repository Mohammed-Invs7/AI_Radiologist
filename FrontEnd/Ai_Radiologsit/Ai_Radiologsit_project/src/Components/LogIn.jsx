import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css"; // ✅ استيراد ملف CSS الجديد

const Login = () => {
    return (
        <div className="fluid vh-100 d-flex">
            {/* الشريط الجانبي */}
            <div className="sidebar">
                <h2>AI Radiologist</h2>
                <p>At Your Service For <br/> Better Health</p>
            </div>

            {/* قسم تسجيل الدخول */}
            <div className="login-container">
                <div className="w-100 text-center mb-4">
                    <h3 className="login-title">WELCOME BACK</h3>
                    <p>Log in to your account</p>
                </div>

                {/* نموذج تسجيل الدخول */}
                <form className="w-100" style={{ maxWidth: "400px" }}>
                    <div className="input-group mb-3 bg-white">
                        <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                        </span>
                        <input type="email" className="form-control" placeholder="Email" required />
                    </div>

                    <div className="input-group mb-3 bg-white">
                        <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                        </span>
                        <input type="password" className="form-control" placeholder="Password" required />
                    </div>

                    <button type="submit" className="btn btn-login">
                        Log In
                    </button>
                </form>

                {/* الروابط الإضافية */}
                <div className="text-links">
                    <a href="/forgot-password">Forgot Password?</a>
                    <br />
                    <a href="/SingIn">Don't have an account? <strong>Sign Up</strong></a>
                </div>
            </div>
        </div>
    );
};

export default Login;
