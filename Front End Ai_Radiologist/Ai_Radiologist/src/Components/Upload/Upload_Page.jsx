import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Upload.css"; 
import NavBar from "../NavBar/NavBar";

const API_URL = "http://localhost:5000/predict"; // AI server endpoint

const Upload_Page = () => {
    const { user } = useAuth(); // Get the authenticated user

    const [formData, setFormData] = useState({
        file: null, // Selected file
        fileName: "No file chosen", // Default file name display
        imagePreview: null, // Preview of the selected image
        type: "", // Type of medical scan
        bodyPart: "", // Body part for analysis
        loading: false, // Loading state for submission
        predictionResult: null, // AI prediction result
    });

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // Get the selected file
        if (selectedFile) {
            setFormData({
                ...formData,
                file: selectedFile, // Store the file
                fileName: selectedFile.name, // Update file name display
                imagePreview: URL.createObjectURL(selectedFile), // Generate image preview
                predictionResult: null, // Reset previous prediction
            });
        }
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value }); // Update input values
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload

        if (!formData.file || !formData.type || !formData.bodyPart) {
            alert("Please select all required fields."); // Show an alert if required fields are missing
            return;
        }

        try {
            setFormData((prev) => ({ ...prev, loading: true, predictionResult: null })); // Start loading

            const uploadData = new FormData();
            uploadData.append("image", formData.file); // Append file
            uploadData.append("type", formData.type); // Append scan type
            uploadData.append("body_part", formData.bodyPart); // Append body part

            const response = await axios.post(API_URL, uploadData, {
                headers: { "Accept": "application/json" }
            });

            if (response.status === 200) {
                setFormData((prev) => ({
                    ...prev,
                    predictionResult: response.data.prediction, // Store AI prediction
                    loading: false, // Stop loading
                }));
            } else {
                throw new Error(response.statusText || "Prediction failed"); // Handle errors
            }
        } catch (error) {
            setFormData((prev) => ({
                ...prev,
                predictionResult: `Error: ${error.response?.data?.error || error.message}`, // Show error message
                loading: false, // Stop loading
            }));
        }
    };

    return (
        <div>
            <NavBar /> {/* Navigation bar */}
            <div className="upload-container d-flex flex-column align-items-center">
                <div className="upload-box d-flex flex-column align-items-center mt-5">
                    <h3 className="upload-header">Upload Your Image</h3>

                    <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                        <input type="file" id="file-input" hidden onChange={handleFileChange} accept="image/*" /> {/* File input */}
                        <label htmlFor="file-input" className="upload-label">Choose File</label>
                        <span className="file-name">{formData.fileName}</span> {/* Display selected file name */}

                        <select name="type" value={formData.type} onChange={handleChange} className="upload-select"> {/* Select scan type */}
                            <option value="">Choose the type</option>
                            <option value="X-ray">X-ray</option>
                            <option value="MRI">MRI</option>
                            <option value="CT Scan">CT Scan</option>
                        </select>

                        <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="upload-select"> {/* Select body part */}
                            <option value="">Choose Body Part</option>
                            <option value="Head">Head</option>
                            <option value="Chest">Chest</option>
                            <option value="Abdomen">Abdomen</option>
                            <option value="Spine">Spine</option>
                            <option value="Arm">Arm</option>
                            <option value="Leg">Leg</option>
                        </select>

                        <button type="submit" className="upload-button" disabled={formData.loading}>
                            {formData.loading ? "Processing..." : "Upload"} {/* Show loading state */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload_Page;
