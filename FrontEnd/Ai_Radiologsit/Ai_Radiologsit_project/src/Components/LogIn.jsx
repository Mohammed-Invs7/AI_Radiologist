import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = () => {
    return (
        <div style={{background:'white'}} className="fluid vh-100 d-flex">
            {/* Sidebar */}
            <div style={{
                background: 'linear-gradient(180deg, #025559 0%, #017276 20%, #80DFDF 100%)',
                borderRadius: '0px 100px 100px 0px',
                width: '300px',
            }}
                className="col-md-5 text-white d-flex flex-column align-items-center">
                
                <h2 style={{margin:'100px 0px 200px 0px'} }
                    className="fw-bold">AI Radiologsit</h2>
                <p className="fs-5 mt-3 text-center">
                    At Your Service For <br/> Better Health
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
                    <div
                        style={{
                            border: "1px solid rgb(141 140 140)", // Border with transparent color
                            borderRadius: "0px", // No border-radius
                        }}
                        className="input-group mb-3 bg-white">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-envelope bg-white"></i>
                        </span>
                        <input style={{borderRadius:'0px'}}
                            type="email"
                            className="form-control border-0"
                            placeholder="Email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div
                        style={{
                            border: "1px solid rgb(141 140 140)", // Border with transparent color
                            borderRadius: "0px", // No border-radius
                        }}
                        className="input-group mb-3 bg-white">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-lock bg-white"></i>
                        </span>
                        <input style={{borderRadius:'0px'}}
                            type="password"
                            className="form-control border-0"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button style={{
                            background: 'linear-gradient(90deg, #017276 0%, #80DFDF 100%)',
                            border: "1px solid rgb(141 140 140)", // Border with transparent color
                            borderRadius: "0px", // No border-radius
                        }}
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
                         style={{color:'#212121'}}
                        className="d-block text-decoration-none mt-2"
                    >
                        Don't have an account? <strong>Sign Up</strong>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
