import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_GET_USER = "http://127.0.0.1:8000/api/v1/auth/user/";
const API_UPDATE_USER = "http://127.0.0.1:8000/api/v1/auth/user/";

const Settings_User = () => {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        gender: "M",
        profile_image: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // ✅ التحقق من تسجيل الدخول
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // ✅ جلب بيانات المستخدم
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_GET_USER, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setUser({
                    first_name: response.data.first_name || "",
                    last_name: response.data.last_name || "",
                    gender: response.data.gender || "M",
                    profile_image: null // لا نحمل الصورة هنا، سيتم رفعها عند التحديث
                });
            } catch (error) {
                console.error("Error fetching user data:", error.response?.data || error);
                setMessage("❌ Error fetching user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // ✅ تحديث القيم عند الإدخال
    const handleChange = (e) => {
        if (e.target.name === "profile_image") {
            setUser({ ...user, profile_image: e.target.files[0] });
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    // ✅ تحديث بيانات المستخدم عند الضغط على "حفظ التغييرات"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("gender", user.gender);

        if (user.profile_image instanceof File) {
            formData.append("profile_image", user.profile_image);
        }

        try {
            const response = await axios.patch(API_UPDATE_USER, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                setMessage("✔ Profile updated successfully!");
            } else {
                setMessage("❌ Update failed. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error);
            setMessage(`❌ Error: ${JSON.stringify(error.response?.data) || "Update failed."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>User Settings</h2>

            {message && <div className="alert alert-info">{message}</div>}

            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            value={user.first_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={user.last_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            className="form-control"
                            name="gender"
                            value={user.gender || "M"}
                            onChange={handleChange}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Profile Image</label>
                        <input
                            type="file"
                            className="form-control"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Settings_User;
