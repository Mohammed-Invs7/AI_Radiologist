import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavBar from "./NavBar";
import image1 from "../assets/image-upload.png";
import Image2 from '../assets/spark, sparkle, 29.png'
import Image3 from '../assets/spark, sparkle, 28.png'
import Image4 from '../assets/arrow, hand drawn, scribble, doodle, 12.png'



import "./Upload.css"; // 🔹 استيراد ملف CSS

const Upload = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // ✅ حالة جديدة

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
      setIsImageUploaded(true); // ✅ تحديث الحالة عند رفع الصورة
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleBodyPartChange = (event) => {
    setSelectedBodyPart(event.target.value);
  };

  const handleCheckImage = () => {
    alert(`Checking the ${selectedType} image of ${selectedBodyPart}: ${fileName}`);
  };

  return (
    <div>
      <NavBar />
      <img src={Image2} alt="Upload" className="upload-icon2" />
      <img src={Image3} alt="Upload" className="upload-icon3" />

      <div className="upload-container d-flex flex-column align-items-center">
        <div className={`upload-box d-flex flex-column align-items-center mt-5 ${isImageUploaded ? "expanded" : ""}`}>
          <div className="upload-header">
            <h3>Upload Your Image</h3>
          </div>
          <div className="upload-box d-flex flex-column align-items-center box-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="upload-preview" />
            ) : (
              <img src={image1} alt="Upload" className="upload-icon1" />
            )}

            <input type="file" id="actual-btn" hidden onChange={handleFileChange} accept="image/*" />

            <label htmlFor="actual-btn" className="upload-label">
              Choose File
            </label>

            <span className="file-name">{fileName}</span>

            {/* ✅ اختيار نوع الصورة */}
            <select value={selectedType} onChange={handleTypeChange} className="upload-select">
              <option value="">Choose the type</option>
              <option value="X-ray">X-ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
            </select>

            {/* ✅ اختيار الجزء من الجسم */}
            <select value={selectedBodyPart} onChange={handleBodyPartChange} className="upload-select">
              <option value="">Choose Body Part</option>
              <option value="Head">Head</option>
              <option value="Chest">Chest</option>
              <option value="Abdomen">Abdomen</option>
              <option value="Spine">Spine</option>
              <option value="Arm">Arm</option>
              <option value="Leg">Leg</option>
            </select>

            <img src={Image4} alt="Upload"   className={`upload-icon4 ${isImageUploaded ? "expanded-icon4" : ""}`}/>

            <button
              className="upload-button"
              onClick={handleCheckImage}
              disabled={!imagePreview || !selectedType || !selectedBodyPart}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
