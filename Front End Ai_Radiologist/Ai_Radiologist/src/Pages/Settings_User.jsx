import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Components/NavBar";
import Swal from "sweetalert2";  
import InfoModal from "../modals/InfoModal";
import PasswordModal from "../modals/PasswordModal";
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
        email: authUser?.email || "",
        age: authUser?.age || "",
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
                    window.location.reload(); 
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
                setPasswordMessage("Password changed successfully!");
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
            <div className="page-form-Settings d-flex justify-content-center align-items-center flex-column mt-3">
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
                        <p className='mb-1'>Gender: {user.gender==='M'?'Male': user.gender==='F'?'Female':user.gender}</p>
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

            {/* Use Modal Components */}
            <InfoModal
                show={showInfoModal}
                user={user}
                onClose={() => setShowInfoModal(false)}
                onSave={handleUpdateInfo}
                loading={loading}
                onChange={handleChange}
                previewImage={previewImage}
            />
            <PasswordModal
                show={showPasswordModal}
                new_password1={new_password1}
                new_password2={new_password2}
                onClose={() => setShowPasswordModal(false)}
                onSave={handleChangePassword}
                setNewPassword1={setNewPassword1}  
                setNewPassword2={setNewPassword2}  
            />
        </>
    );
};

export default Settings_User;
