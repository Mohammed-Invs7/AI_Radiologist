import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Components/NavBar";
import Swal from "sweetalert2";  // استيراد مكتبة SweetAlert2
import { motion } from 'framer-motion';
import "../assets/Styling/Setting_User.css";
import "../assets/Styling/Form_User.css";

const API_URL = "http://127.0.0.1:8000/api/v1/auth/user/";

const Settings_User = () => {
    const { user: authUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: authUser?.first_name || "",
        last_name: authUser?.last_name || "",
        gender: authUser?.gender || "",
        email: authUser?.email ||"",
        age:authUser?.age||"",
        profile_image: authUser?.profile_image || null,
    });

    const [previewImage, setPreviewImage] = useState(authUser?.profile_image || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Modals
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Password fields
    const [new_password1, setNewPassword1] = useState("");
    const [new_password2, setNewPassword2] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    const handleChange = (e) => {
        if (e.target.name === "profile_image") {
            const file = e.target.files[0];
            if (file) {
                setUser({ ...user, profile_image: file });
                setPreviewImage(URL.createObjectURL(file));
            }
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("gender", user.gender);
        if (user.profile_image && user.profile_image.name) {
            formData.append("profile_image", user.profile_image);
        }

        try {
            const response = await axios.patch(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                const updatedUserData = {
                    ...response.data,
                    user_type: response.data.user_type === 1 ? "admin" : "user",
                };
                updateUser(updatedUserData);
                setPreviewImage(`http://127.0.0.1:8000${updatedUserData.profile_image}`);
                setShowInfoModal(false);

                Swal.fire({
                    title: "Success",
                    text: "✔ Info updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    window.location.reload(); // 🚀 Reload after confirmation
                });
            }
        } catch (error) {
            console.error("Error updating info:", error);
            setMessage("An unexpected error occurred.");
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/auth/password/change/",
                { new_password1, new_password2 },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                setPasswordMessage("✅ Password changed successfully!");
                setNewPassword1("");
                setNewPassword2("");
                setTimeout(() => setShowPasswordModal(false), 1500);

                Swal.fire({
                    title: "Success",
                    text: "✅ Password changed successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Change password error:", error.response);
            setPasswordMessage(
                error.response?.data?.new_password1?.[0] ||
                error.response?.data?.new_password2?.[0] ||
                error.response?.data?.detail ||
                "An unexpected error occurred."
            );
            Swal.fire({
                title: "Error",
                text: passwordMessage || "An unexpected error occurred.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <>
            <NavBar />
            <div style={{ background: "#f8f9fa" }} className="page-form-Settings d-flex justify-content-center align-items-center flex-column mt-3">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='box-user d-flex align-items-center gap-5 mb-5'
                >
                    <motion.div
                        className='img-user'
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={previewImage}
                            alt="User Profile"
                            className="rounded-circle"
                            style={{ width: '140px', height: '140px'}}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h4>{user.first_name} {user.last_name}</h4>
                        <p className='mb-1'>Email: {user.email}</p>
                        <p className='mb-1'>Age: {user.age}</p>
                        <p className='mb-1'>Gender: {user.gender}</p>
                    </motion.div>
                </motion.div>

                {message && <div className="alert alert-info text-center">{message}</div>}

                <motion.div
                    className="table-responsive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <table className="table table-custom table-bordered">
                        <thead>
                            <tr>
                                <th style={{ background: "#017276" }} colSpan="2">Account Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="d-flex justify-content-between align-items-center gap">
                                    Edit Personal Info
                                    <i className="bx bx-edit-alt edit-icon-btn" onClick={() => setShowInfoModal(true)}></i>
                                </td>
                            </tr>
                            <tr>
                                <td className="d-flex justify-content-between align-items-center gap">
                                    Change Password
                                    <i className="bx bx-edit-alt edit-icon-btn" onClick={() => setShowPasswordModal(true)}></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>
            </div>

            {/* Personal Info Modal */}
            {showInfoModal && (
                <motion.div 
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateInfo}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Personal Info</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowInfoModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex align-items-center flex-column">
                                        {previewImage && (
                                            <div className="mb-3 text-center align-items-center rounded-circle border border-dark bg-white shadow" style={{ width: '120px', height: '120px' }}>
                                                <img src={previewImage} alt="Profile Preview" className="rounded-circle" style={{ width: '118px', height: '118px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <label className="custom-upload-button">
                                            Change your Image
                                            <input
                                                type="file"
                                                className="hidden-file-input"
                                                name="profile_image"
                                                accept="image/*"
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>

                                    <div className="mb-3">
                                        <label>First Name</label>
                                        <motion.input
                                            type="text"
                                            className="form-control"
                                            name="first_name"
                                            value={user.first_name}
                                            onChange={handleChange}
                                            required
                                            whileFocus={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Last Name</label>
                                        <motion.input
                                            type="text"
                                            className="form-control"
                                            name="last_name"
                                            value={user.last_name}
                                            onChange={handleChange}
                                            required
                                            whileFocus={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Gender</label>
                                        <select
                                            className="form-control"
                                            name="gender"
                                            value={user.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <motion.button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowInfoModal(false)}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <motion.div 
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={new_password1}
                                        onChange={(e) => setNewPassword1(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={new_password2}
                                        onChange={(e) => setNewPassword2(e.target.value)}
                                    />
                                </div>
                                {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Close</button>
                                <motion.button className="btn btn-danger" onClick={handleChangePassword} whileHover={{ scale: 1.1 }}>
                                    Save Changes
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Settings_User;
