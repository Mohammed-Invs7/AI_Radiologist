import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image1 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/image-upload.png";
import Image2 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/spark, sparkle, 29.png";
import Image3 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/spark, sparkle, 28.png";
import Image4 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/arrow, hand drawn, scribble, doodle, 12.png";
import "./Upload.css"; // Import CSS file
import NavBar from "../NavBar/NavBar";

const API_URL = "http://localhost:5000/predict"; // AI server URL

const Upload_Page = () => {
  const [formData, setFormData] = useState({
    file: null,
    fileName: "No file chosen",
    imagePreview: null,
    type: "",
    bodyPart: "",
    loading: false,
    predictionResult: null,
  });

  //  Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFormData({
        ...formData,
        file: selectedFile,
        fileName: selectedFile.name,
        imagePreview: URL.createObjectURL(selectedFile),
        predictionResult: null,
      });
    }
  };

  //  Handle input field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  //  Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    //  Check if all required fields are filled
    if (!formData.file || !formData.type || !formData.bodyPart) {
      alert("Please select all required fields.");
      return;
    }

    try {
      setFormData((prev) => ({ ...prev, loading: true, predictionResult: null }));

      //  Prepare FormData
      const uploadData = new FormData();
      uploadData.append("image", formData.file);
      uploadData.append("type", formData.type);
      uploadData.append("body_part", formData.bodyPart);

      //  Send request to AI API using axios
      const response = await axios.post(API_URL, uploadData, {
        headers: { "Accept": "application/json" }
      });

      console.log("✅ Server Response:", response.data); // Debugging

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          predictionResult: response.data.prediction, // ✅ تحديث النتيجة
          loading: false,
        }));
      } else {
        throw new Error(response.statusText || "❌ Prediction failed");
      }
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        predictionResult: `❌ خطأ: ${error.response?.data?.error || error.message}`,
        loading: false,
      }));
      console.error("❌ Error:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <img src={Image2} alt="Upload" className="upload-icon2" />
      <img src={Image3} alt="Upload" className="upload-icon3" />

      <div className="upload-container d-flex flex-column align-items-center">
        <div className="upload-box d-flex flex-column align-items-center mt-5">
          <h3 className="upload-header">Upload Your Image</h3>

          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            {/* ✅ Display selected image or default icon */}
            <img src={formData.imagePreview || Image1} alt="Preview" className={formData.imagePreview ? "upload-preview" : "upload-icon1"} />

            {/*  File selection button */}
            <input type="file" id="file-input" hidden onChange={handleFileChange} accept="image/*" />
            <label htmlFor="file-input" className="upload-label">Choose File</label>
            <span className="file-name">{formData.fileName}</span>

            {/*  Select image type */}
            <select name="type" value={formData.type} onChange={handleChange} className="upload-select">
              <option value="">Choose the type</option>
              <option value="X-ray">X-ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
            </select>

            {/*  Select body part */}
            <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="upload-select">
              <option value="">Choose Body Part</option>
              <option value="Head">Head</option>
              <option value="Chest">Chest</option>
              <option value="Abdomen">Abdomen</option>
              <option value="Spine">Spine</option>
              <option value="Arm">Arm</option>
              <option value="Leg">Leg</option>
            </select>

            {/* ✅ Arrow icon */}
            <img src={Image4} alt="Upload" className={`upload-icon4 ${formData.imagePreview ? "image-uploaded" : ""}`} />

            {/* ✅ Upload button */}
            <button type="submit" className="upload-button" disabled={formData.loading}>
              {formData.loading ? "Processing..." : "Upload"}
            </button>

            {/* ✅ Show loading spinner */}
            {formData.loading && (
              <div className="text-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
              </div>
            )}

            {/* ✅ Display AI prediction result */}
            {formData.predictionResult && (
              <div className="result-box mt-3">
                <h5>AI Prediction:</h5>
                <p>{formData.predictionResult}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload_Page;
