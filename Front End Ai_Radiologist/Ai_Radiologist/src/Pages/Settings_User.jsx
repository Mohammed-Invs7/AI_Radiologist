import { useState, useEffect } from "react"; // Import React hooks for state and side effects
import axios from "axios"; // Import Axios for API requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuth } from "../context/AuthContext"; // Import AuthContext to get user data and update function
import NavBar from "../Components/NavBar"
import "../assets/Styling/Setting_User.css"
import "../assets/Styling/Form_User.css"


const API_URL = "http://127.0.0.1:8000/api/v1/auth/user/"; // API endpoint for fetching and updating user data

const Settings_User = () => {
    const { user: authUser, updateUser } = useAuth(); // Get authenticated user and update function from AuthContext
    const navigate = useNavigate(); // Initialize navigation function

    // Initialize user state with default values or data from AuthContext
    const [user, setUser] = useState({
        first_name: authUser?.first_name || "",
        last_name: authUser?.last_name || "",
        gender: authUser?.gender || "M",
        profile_image: authUser?.profile_image || null
    });

    const [previewImage, setPreviewImage] = useState(authUser?.profile_image || null); // Store preview of uploaded image
    const [loading, setLoading] = useState(false); // State for loading status
    const [message, setMessage] = useState(""); // State for success/error messages

    // Redirect to login if no token is found
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Handle input field changes (text and file inputs)
    const handleChange = (e) => {
        if (e.target.name === "profile_image") {
            const file = e.target.files[0];
            if (file) {
                setUser({ ...user, profile_image: file });
                setPreviewImage(URL.createObjectURL(file)); // Display image preview
            }
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    // Handle form submission to update user profile
    const handleSubmit = async (e) => {
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
            setMessage("✔ Profile updated successfully!");
            
            const userTypeResponse = await axios.get("http://127.0.0.1:8000/api/v1/user/user-type/", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });

            let userType = "";
            if (userTypeResponse.data.id === 1) {
                userType = "admin";
            } else if (userTypeResponse.data.id === 2) {
                userType = "user";
            } else {
                userType = "unknown";
            }

            const updatedUserData = {
                ...response.data,
                user_type: userType, 
            };

            updateUser(updatedUserData); 
            setPreviewImage(updatedUserData.profile_image || null);
        } else {
            setMessage("❌ Update failed. Please try again.");
        }
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error);
        setMessage(error.response?.data?.detail || "An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};


    return (
        <>
            <NavBar/>
            <div className="page-form-Settings " >
            
            <div className="container-form-Settings">
                <div>

                </div>
            {message && <div className=" text-center mt-3">{message}</div>} {/* Display success/error message */}

            {loading ? (
                <p>Loading user data...</p> // Show loading message while updating
            ) : (
                <form className="w-50 mt-3 container d-flex align-items-center flex-column" onSubmit={handleSubmit}>
                <div className="d-flex align-items-center flex-column">
                            {previewImage && (
                            <div className="mb-3 text-center align-items-center rounded-circle border border-dark bg-white shadow"
                                style={{ width: '120px', height: '120px' }}>
                                    <img src={previewImage} alt="Profile Preview"
                                    className="rounded-circle" style={{ width: '118px', height: '118px', objectFit: 'cover' }} />

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
                    {/* First Name Input */}
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control input-Name"
                            name="first_name"
                            value={user.first_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Last Name Input */}
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control input-Name"
                            name="last_name"
                            value={user.last_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Gender Selection */}
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
                    {/* Save Button */}
                    <button  type="submit" className="btn btn-submit Save-Button " disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
                )}
            </div>
        </div></>
        
    
    );
};

export default Settings_User;
