import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image1 from "../assets/Images/image-upload.png";
import "../assets/Styling/Upload.css";
import NavBar from "../Components/NavBar";
import { useAuth } from "../context/AuthContext";
import html2pdf from "html2pdf.js";

const Upload = () => {
  const { token, user } = useAuth();

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
      setFormData((prev) => ({
        ...prev,
        errorMessage: "Please upload an image",
      }));
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
    window.location.reload();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("report-content");

    const buttons = document.querySelectorAll(".no-print");
    buttons.forEach((btn) => (btn.style.display = "none"));

    const options = {
      margin: 0.5,
      filename: "medical_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        buttons.forEach((btn) => (btn.style.display = "flex"));
      });
  };


  return (
    <div>
      <NavBar />
      <div className="upload-container d-flex flex-column align-items-center">
        <div className="upload-box d-flex flex-column align-items-center mt-5">
          <h3 className="upload-header">Upload Your Image</h3>

          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column align-items-center"
          >
            <div className="image-preview-container">
              <img
                src={formData.imagePreview1 || Image1}
                alt="Preview 1"
                className="upload-preview"
              />
            </div>

            <input
              type="file"
              id="file-input-1"
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="file-input-1" className="upload-label">
              Choose File
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="upload-select"
            >
              <option value=""> Chest Type</option>
              <option value="X-ray">X-ray</option>
            </select>

            <select
              name="bodyPart"
              value={formData.bodyPart}
              onChange={handleChange}
              className="upload-select"
            >
              <option value="">Chest Part</option>
              <option value="Chest">Chest</option>
            </select>

            <button
              type="submit"
              className={`upload-button ${
                formData.loading ||
                !formData.file1 ||
                !formData.type ||
                !formData.bodyPart
                  ? "disabled-button"
                  : "enabled"
              }`}
              disabled={
                formData.loading ||
                !formData.file1 ||
                !formData.type ||
                !formData.bodyPart
              }
            >
              {formData.loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </>
              ) : (
                "Upload"
              )}
            </button>

            {formData.errorMessage && (
              <div className="alert alert-danger mt-3">
                {formData.errorMessage}
              </div>
            )}
          </form>
        </div>

        {formData.predictionResult && (
          <div
            id="report-content"
            className="report-container mt-4 p-4 bg-light rounded shadow-sm w-75 border border-secondary-subtle"
          >
            <div className="mb-4 border-bottom pb-3">
              <h4 className="fw-bold text-primary">Medical Report</h4>
              <p>
                <strong>Name:</strong> {user?.first_name} {user?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="container mt-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="text-primary mb-3">Technical Description</h5>
                  <p>
                    A chest X-ray was performed using a standard X-ray machine.
                    The chest was imaged in both the anterior and posterior
                    positions.
                  </p>

                  <h5 className="text-info mt-4">Results</h5>
                  <ul>
                    <li>
                      <div>
                        <p>{formData.predictionResult}</p>
                      </div>
                    </li>
                  </ul>

                  <h5 className="text-info mt-4">Clinical Interpretation</h5>
                  <p>
                    The model demonstrates low accuracy in detecting minor
                    changes in the lung tissue. Therefore, the results cannot be
                    considered 100% accurate in this preliminary version. There
                    may be false positives or false negatives.
                  </p>

                  <h5 className="text-info mt-4">Recommendations</h5>
                  <ol>
                    <li>
                      Further tests are required to verify the area indicated by
                      the model in the left lung.
                    </li>
                    <li>
                      Follow-up clinical evaluation with the physician is
                      advised.
                    </li>
                  </ol>

                  <h5 className="text-info mt-4">Confidence Level</h5>
                  <p>
                    The confidence level in the results is around 70% based on
                    the available data. It is recommended that this report be
                    considered as part of a comprehensive examination.
                  </p>

                  <h5 className="text-info mt-4">Additional Notes</h5>
                  <ul>
                    <li>
                      This report is based on an AI model in development. The
                      results may contain errors or warnings due to the
                      preliminary version of the system.
                    </li>
                    <li>
                      Human medical evaluation is still necessary to review the
                      results.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4 no-print">
              <button className="btn btn-success" onClick={handleDownloadPDF}>
                <i className="bi bi-download me-2"></i>Download Report
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                <i className="bi bi-upload me-2"></i>Upload New Image
              </button>
            </div>
            
          </div>
          
        )}
        
      </div>
      
    </div>
  );
};

export default Upload;
