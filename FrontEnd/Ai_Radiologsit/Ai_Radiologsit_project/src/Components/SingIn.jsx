import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./signIn.css"; // استيراد ملف CSS

const SignIn = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        dob: "",
        gender: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("https://api.example.com/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Registration failed");

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => { window.location.href = "/login"; }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="d-flex">
            <div className="sidebar col-md-5 d-flex flex-column align-items-center">
                <h2>AI Radiologist</h2>
                <p className="fs-5 mt-3">At Your Service For <br /> Better Health</p>
            </div>

            

            <div className="form-container">
                <div className="w-100 text-center m-3">
                    <h3 className="fw-bold">WELCOME</h3>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form className="w-100" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                    {[ { name: "name", placeholder: "Name", icon: "person" },
                        { name: "username", placeholder: "User Name", icon: "person" },
                        { name: "email", placeholder: "Email", icon: "envelope" },
                        { name: "password", placeholder: "Password", icon: "lock", type: "password" },
                        { name: "dob", placeholder: "Date of Birth", icon: "calendar", type: "date" }]
                        .map((field, index) => (
                            <div key={index} className="input-group mb-3 bg-white">
                                <span className="input-group-text bg-white">
                                    <i className={`bi bi-${field.icon}`}></i>
                                </span>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    className="form-control border-0"
                                    placeholder={field.placeholder}
                                    required
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                    <div className="mb-3">
                        <label className="form-label d-block">Gender</label>
                        {[ { id: "male", label: "Male", value: "male" },
                           { id: "female", label: "Female", value: "female" }]
                            .map((gender) => (
                                <div key={gender.id} className="form-check form-check-inline">
                                    <input
                                        className="form-check-input radio"
                                        type="radio"
                                        name="gender"
                                        id={gender.id}
                                        value={gender.value}
                                        required
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={gender.id}>{gender.label}</label>
                                </div>
                            ))}
                    </div>

                    <button type="submit" className="btn btn-submit">
                        Become a Member →
                    </button>
                </form>

                
            </div>

            <div>
                    <a href="/login" className="login-link">
                        Already a Member? <strong>LOG IN NOW</strong>
                    </a>
                </div>
        </div>
    );
};

export default SignIn;
