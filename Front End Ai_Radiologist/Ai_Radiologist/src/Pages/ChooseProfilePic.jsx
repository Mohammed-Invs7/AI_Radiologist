import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
import Image1 from "../../assets/Vectorprofile.png";

const API_URL = "http://localhost:5000/upload-profile";  // API to store the image
const DEFAULT_PROFILE_PIC = Image1  // Default profile picture

const ChooseProfilePic = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null); // Store the image
    const [preview, setPreview] = useState(null); // Preview link
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fileInputRef = useRef(null);  // Ref to open the file selection window when clicking the button

    const username = localStorage.getItem("username") || "Guest";
    // Handle image change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Create preview link
        }
    };

    // Upload the image to the server
    const handleUpload = async () => {
        if (!file) {
            setMessage("❌ Please select an image before submitting!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("profilePic", file); // Add the image to `FormData`

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            localStorage.setItem("userProfilePic", response.data.profilePicUrl); // Save the new image
            navigate("/dashboard"); // Redirect to the main page
        } catch (error) {
            setMessage("Error");
            console.error(" Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // User chose to skip
    const handleSkip = () => {
        localStorage.setItem("userProfilePic", DEFAULT_PROFILE_PIC); // Save the default image
        navigate("/dashboard"); // Redirect to the main page
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar section */}
                <div className="col-md-4 d-flex justify-content-center align-items-center p-0 m-0">
                    <div className="sidebar text-center">
                        <h2>AI Radiologist</h2>
                        <p className="fs-5 mt-3">
                            At Your Service For <br /> Better Health
                        </p>
                    </div>
                </div>

                {/* Main content section */}
                <div className="col-md-8 d-flex justify-content-center ">
                    <div className="container text-center flex-column d-flex align-items-center justify-content-center p-0">
                        <h2 className="mb-5">Welcome {username}</h2>

                        {/* Display the selected or default image */}
                        <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", background: "#E7E7FF" }}>
                        <img 
                            src={preview || DEFAULT_PROFILE_PIC}
                            alt="Profile Preview"
                            className="img-fluid "  // Adapts to all screen sizes
                            style={{ objectFit: "cover" , width:"85%" }}  // Ensures the image covers the container fully
                        />
                        </div>

                        <div style={{gap:"200px"}} className="d-flex justify-content-center align-items-center  mt-5 ">
                            {/* Choose image button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="btn btn-secondary px-3 rounded-4 "
                                style={{ minWidth: "200px", background: "linear-gradient(90deg, #017276 0%, #80DFDF 100%)" }}  // Ensures button size
                            >
                                Choose Image
                            </button>

                            {/* Hide input type="file" */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: "none" }} // Hide the element
                                
                            />

                            {/* Skip image button */}
                            <button
                                onClick={handleSkip}
                                className="btn btn-secondary px-5 rounded-4"
                                style={{ minWidth: "200px", background:"linear-gradient(90deg, #017276 0%, #80DFDF 100%)" }}  // Ensures button size
                            >
                                    
                                
                                Skip
                            </button>
                        </div>

                        <div>
                        {/* Show save button only after selecting an image */}
                        {file && (
                            <button
                                onClick={handleUpload}
                                className="btn mt-4 rounded-4"
                                disabled={loading}
                                    style={{
                                        minWidth: "200px",
                                        background: "#017276"  // Ensures button size
                                    }}    
                            >
                                {loading ? "Saving" : "Save Image"}
                            </button>
                        )}
                        </div>
                        {/* Display message after save or skip */}
                        {message && <p className="mt-3 d-none">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseProfilePic;
