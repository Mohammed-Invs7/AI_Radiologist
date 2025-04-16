import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image1 from "../assets/Images/image-upload.png";
import "../assets/Styling/Upload.css";
import NavBar from "../Components/NavBar";
import { useAuth } from "../context/AuthContext"; 

const Upload = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    file1: null,
    imagePreview1: null,
    type: "",
    bodyPart: "",
    loading: false,
    predictionResult: null,
    errorMessage: null,
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        file1: selectedFile,
        imagePreview1: URL.createObjectURL(selectedFile),
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

  if (!formData.file1) {
    setFormData((prev) => ({ ...prev, errorMessage: "Please upload an image" }));
    return;
  }

  try {
    setFormData((prev) => ({
      ...prev,
      loading: true,
      predictionResult: null,
      errorMessage: null,
    }));

    const form = new FormData();
    form.append("image_path", formData.file1); 

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/user/reports/create/",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Upload success:", response.data);

    setFormData((prev) => ({
      ...prev,
      predictionResult: response.data.report_details,
      loading: false,
    }));
  } catch (error) {
    console.error("Upload error:", error);
    console.log("Server response:", error.response?.data);
    setFormData((prev) => ({
      ...prev,
      errorMessage: "Failed to upload image or generate report.",
      loading: false,
    }));
  }
};


  const handleReset = () => {
    setFormData({
      file1: null,
      imagePreview1: null,
      type: "",
      bodyPart: "",
      loading: false,
      predictionResult: null,
      errorMessage: null,
    });
  };

  return (
    <div>
      <NavBar />
      <div className="upload-container d-flex flex-column align-items-center">
        <div className="upload-box d-flex flex-column align-items-center mt-5">
          <h3 className="upload-header">Upload Your Image</h3>

          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="image-preview-container">
              <img src={formData.imagePreview1 || Image1} alt="Preview 1" className="upload-preview" />
            </div>

            <input type="file" id="file-input-1" hidden onChange={handleFileChange} accept="image/*" />
            <label htmlFor="file-input-1" className="upload-label">Choose File</label>

            <select name="type" value={formData.type} onChange={handleChange} className="upload-select">
              <option value=""> Chest Type</option>
              <option value="X-ray">X-ray</option>
            </select>

            <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="upload-select">
              <option value="">Chest Part</option>
              <option value="Chest">Chest</option>
            </select>

            <button
              type="submit"
              className={`upload-button ${formData.loading || !formData.file1 || !formData.type || !formData.bodyPart ? "disabled-button" : "enabled"}`}
              disabled={formData.loading || !formData.file1 || !formData.type || !formData.bodyPart}
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
          </form>
        </div>

        {formData.predictionResult && (
          <div className="report-container mt-4 p-4 bg-light rounded shadow-sm w-75">
            <h5 className="text-primary fw-bold mb-3">Report</h5>
            <p>{formData.predictionResult}</p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-success">Download Report</button>
              <button className="btn btn-outline-secondary" onClick={handleReset}>Upload New Image</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
