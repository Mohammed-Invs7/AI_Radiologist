import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
const SingIn=()=> {
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

            {/* Sign-Up Form Section */}
            <div className="col-md-7 d-flex flex-column justify-content-center align-items-center px-5">
                <div className="w-100 text-center mb-4">
                    <h3 className="fw-bold">BECOME AN EXCLUSIVE MEMBER</h3>
                    <p>SIGN UP AND JOIN THE PARTNERSHIP</p>
                </div>

                {/* Sign-Up Form */}
                <form className="w-100" style={{ maxWidth: "400px" }}>
                    {/* User Name Field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <i className="bi bi-person"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="User Name"
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <i className="bi bi-telephone"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            required
                        />
                    </div>

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
                    <button style={{background: '#2C9E84'}}
                        type="submit"
                        className="btn w-100 fw-bold text-white"
                    >
                        Become a Member →
                    </button>
                </form>

                {/* Additional Links */}
                <div className="text-center mt-4">
                    <a href="/login" className="d-block text-decoration-none text-success">
                        Already a Member? <strong>LOG IN NOW</strong>
                    </a>
                    
                </div>
            </div>
        </div>
    );
}
export default SingIn;