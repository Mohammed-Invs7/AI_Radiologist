import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image1 from "../assets/Images/image-upload.png";
import "../assets/Styling/Upload.css";
import NavBar from "../Components/NavBar";

const API_URL = "http://localhost:5000/predict";

const Upload = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    file1: null,
    file2: null,
    imagePreview1: null,
    imagePreview2: null,
    type: "",
    bodyPart: "",
    loading: false,
    predictionResult: null,
    errorMessage: null,
  });

  const handleFileChange = (event, fileNumber) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        [`file${fileNumber}`]: selectedFile,
        [`imagePreview${fileNumber}`]: URL.createObjectURL(selectedFile),
        predictionResult: null,
        errorMessage: null,
      }));
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.file1 && !formData.file2) {
      setFormData((prev) => ({ ...prev, errorMessage: "Please upload at least one image" }));
      return;
    }

    try {
      setFormData((prev) => ({ ...prev, loading: true, predictionResult: null, errorMessage: null }));

      const uploadData = new FormData();

      if (formData.file1 && !formData.file2) {
        uploadData.append("image1", formData.file1);
        uploadData.append("image2", formData.file1);
      } else if (!formData.file1 && formData.file2) {
        uploadData.append("image1", formData.file2);
        uploadData.append("image2", formData.file2);
      } else {
        uploadData.append("image1", formData.file1);
        uploadData.append("image2", formData.file2);
      }

      uploadData.append("type", formData.type);
      uploadData.append("body_part", formData.bodyPart);

      const response = await axios.post(API_URL, uploadData, {
        headers: { Accept: "application/json" },
      });

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          predictionResult: response.data.prediction,
          loading: false,
        }));
      } else {
        throw new Error(response.statusText || "Prediction failed, please try again");
      }
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        errorMessage: error.response?.data?.error || "An error occurred while uploading the images",
        loading: false,
      }));
    }
  };

  return (
    <div>
      <NavBar />
      <div className="upload-container d-flex flex-column align-items-center">
        <div className="upload-box d-flex flex-column align-items-center mt-5">
          <h3 className="upload-header">Upload Images</h3>

          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="image-preview-container">
              <img src={formData.imagePreview1 || Image1} alt="Preview 1" className="upload-preview" />
              <img src={formData.imagePreview2 || Image1} alt="Preview 2" className="upload-preview" />
            </div>

            <input type="file" id="file-input-1" hidden onChange={(e) => handleFileChange(e, 1)} accept="image/*" />
            <label htmlFor="file-input-1" className="upload-label">Choose the first image</label>

            <input type="file" id="file-input-2" hidden onChange={(e) => handleFileChange(e, 2)} accept="image/*" />
            <label htmlFor="file-input-2" className="upload-label">Choose the second image (optional)</label>

            <select name="type" value={formData.type} onChange={handleChange} className="upload-select">
              <option value="">Select Type</option>
              <option value="X-ray">X-ray</option>

            </select>

            <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="upload-select">
              <option value="">Select Body Part</option>
              <option value="Chest">Chest</option>
            </select>

            <button 
  type="submit" 
  className={`upload-button ${formData.loading || !formData.file1 && !formData.file2 || !formData.type || !formData.bodyPart ? "disabled-button" : "enabled"}`}
  disabled={formData.loading || !formData.file1 && !formData.file2 || !formData.type || !formData.bodyPart}
>
  {formData.loading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Processing...
    </>
  ) : (
    "Upload"
  )}
            </button>

            {formData.errorMessage && <div className="alert alert-danger mt-3">{formData.errorMessage}</div>}

            {formData.predictionResult && (
              <div className="result-box mt-3">
                <h5>AI Prediction Result:</h5>
                <p>{formData.predictionResult}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
