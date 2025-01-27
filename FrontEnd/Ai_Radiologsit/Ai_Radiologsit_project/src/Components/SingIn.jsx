import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const SignIn = () => {
    // الأنماط العامة
    const inputStyle = {
        border: "1px solid rgb(141 140 140)",
        borderRadius: "0px",
    };
    const gradientBackground = 'linear-gradient(90deg, #017276 0%, #80DFDF 100%)';

    return (
        <div
            style={{ margin: '0px' }}
            className="d-flex">
            {/* Sidebar */}
            <div
                style={{
                    background: 'linear-gradient(180deg, #025559 0%, #017276 20%, #80DFDF 100%)',
                    borderRadius: '0px 100px 100px 0px',
                    width: '300px',
                }}
                className="col-md-5 text-white d-flex flex-column align-items-center"
            >
                <h2 style={{ margin: '100px 0px 200px 0px' }} className="fw-bold">
                    AI Radiologist
                </h2>
                <p className="fs-5 mt-3 text-center">
                    At Your Service For <br /> Better Health
                </p>
            </div>

            {/* Sign-Up Form Section */}
            <div
                style={{ width: '600px' }}
                className="d-flex flex-column justify-content-center align-items-center"
            >
                <div className="w-100 text-center m-3">
                    <h3 className="fw-bold">WELCOME</h3>
                </div>

                {/* Sign-Up Form */}
                <form className="w-100" style={{ maxWidth: "400px" }}>
                    {/* Input Fields */}
                    {[
                        { type: "text", placeholder: "Name", icon: "person" },
                        { type: "text", placeholder: "User Name", icon: "person" },
                        { type: "email", placeholder: "Email", icon: "envelope" },
                        { type: "password", placeholder: "Password", icon: "lock" },
                        { type: "text", placeholder: "Phone", icon: "telephone" },
                        { type: "date", placeholder: "Date of Birth", icon: "calendar" },
                    ].map((field, index) => (
                        <div
                            key={index}
                            className="input-group mb-3 bg-white"
                            style={inputStyle}
                        >
                            <span className="input-group-text bg-white">
                                <i className={`bi bi-${field.icon} bg-white`}></i>
                            </span>
                            <input
                                style={{ borderRadius: "0px", border: "none" }}
                                type={field.type}
                                className="form-control border-0"
                                placeholder={field.placeholder}
                                required
                            />
                        </div>
                    ))}

                    {/* Gender Field */}
                    <div className="mb-3">
                        <label className="form-label d-block">Gender</label>
                        {[
                            { id: "male", label: "Male", value: "male" },
                            { id: "female", label: "Female", value: "female" },
                        ].map((gender) => (
                            <div key={gender.id} className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id={gender.id}
                                    value={gender.value}
                                    required
                                />
                                <label className="form-check-label" htmlFor={gender.id}>
                                    {gender.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        style={{
                            background: gradientBackground,
                            border: "none",
                            borderRadius: "0px",
                        }}
                        type="submit"
                        className="btn w-100 fw-bold text-white"
                    >
                        Become a Member →
                    </button>
                </form>

            </div>
             {/* Additional Links */}
                <div>
                    <a
                        href="/login"
                        style={{ fontSize: '10px', color: '#212121' }}
                        className="text-decoration-none"
                    >
                        Already a Member? <strong>LOG IN NOW</strong>
                    </a>
                </div>
        </div>
    );
};

export default SignIn;
