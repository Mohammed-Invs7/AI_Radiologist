import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { motion, AnimatePresence } from "framer-motion";
import Image1 from "../assets/Images/image-upload.png";
import "../assets/Styling/Upload.css";
import NavBar from "../Components/NavBar";
import { useAuth } from "../context/AuthContext";
// import html2pdf from "html2pdf.js";
import { BASE_URL } from "../config";

const API_CREATE_REPORT = `${BASE_URL}/user/reports/create/`;

const Upload = () => {
  const { token, user } = useAuth();

  const [radioOptions, setRadioOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    file1: null,
    imagePreview1: null,
    type: "",
    bodyPart: "",
    loading: false,
    predictionResult: null,
    errorMessage: null,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/user/reports/options/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRadioOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch radio options", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [token]);

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

    if (!formData.file1 || !formData.type || !formData.bodyPart) {
      setFormData((prev) => ({
        ...prev,
        errorMessage: "Please complete all fields",
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
      form.append("radio_modality", formData.type);
      form.append("body_ana", formData.bodyPart);

      const response = await axios.post(`${API_CREATE_REPORT}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

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
        errorMessage:
          error.response?.data?.detail || "Failed to upload or generate report",
        loading: false,
      }));
    }
  };

  // const handleReset = () => {
  //   window.location.reload();
  // };

  // const handleDownloadPDF = () => {
  //   const element = document.getElementById("report-content");

  //   const buttons = element.querySelectorAll(".no-print");

  //   const removedElements = [];

  //   buttons.forEach((btn) => {
  //     removedElements.push(btn);
  //     btn.parentNode.removeChild(btn);
  //   });

  //   const options = {
  //     margin: 0.5,
  //     filename: "medical_report.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  //     pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  //   };

  //   html2pdf()
  //     .set(options)
  //     .from(element)
  //     .save()
  //     .then(() => {
  //       const buttonContainer = document.createElement("div");
  //       buttonContainer.className =
  //         "d-flex justify-content-center gap-3 mt-4 no-print";
  //       removedElements.forEach((btn) => buttonContainer.appendChild(btn));
  //       element.appendChild(buttonContainer);
  //     });
  // };

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
            {/* Image Preview with Animation */}
            <motion.div
              key={formData.imagePreview1 || "default"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="image-preview-container"
            >
              <img
                src={formData.imagePreview1 || Image1}
                alt="Preview 1"
                className="upload-preview"
              />
            </motion.div>

            {/* Upload Image */}
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

            {/* Modality Select */}
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="upload-select"
            >
              <option value="">
                {loadingOptions ? "Loading modalities..." : "Select Modality"}
              </option>
              {radioOptions.map((modality) => (
                <option key={modality.modality.id} value={modality.modality.id}>
                  {modality.modality.name}
                </option>
              ))}
            </select>

            {/* Body Part Select with Animation */}
            <AnimatePresence mode="wait">
              {formData.type && (
                <motion.div
                  key={formData.type}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-100"
                >
                  <select
                    name="bodyPart"
                    value={formData.bodyPart}
                    onChange={handleChange}
                    className="upload-select"
                  >
                    <option value="">
                      {loadingOptions
                        ? "Loading regions..."
                        : "Select Body Part"}
                    </option>
                    {radioOptions
                      .find(
                        (opt) => opt.modality.id === parseInt(formData.type)
                      )
                      ?.regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Button */}
            <button
              type="submit"
              className={`upload-button mt-4 ${
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

            {/* Error Message */}
            {formData.errorMessage && (
              <div className="alert alert-danger mt-3">
                {formData.errorMessage}
              </div>
            )}
          </form>
        </div>

        {/* Report Section */}
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
                    The chest was imaged in both anterior and posterior
                    positions.
                  </p>

                  <h5 style={{ color: "red" }} className="mt-4">
                    Results
                  </h5>
                  <p>{formData.predictionResult}</p>

                  <h5 className="text-info mt-4">Clinical Interpretation</h5>
                  <p>
                    The model demonstrates low accuracy in detecting minor
                    changes. Results are preliminary and must be confirmed.
                  </p>

                  <h5 className="text-info mt-4">Recommendations</h5>
                  <ol>
                    <li>Further tests are advised.</li>
                    <li>Follow-up with a physician is needed.</li>
                  </ol>

                  <h5 className="text-info mt-4">Confidence Level</h5>
                  <p>Approximate confidence is 70% based on AI performance.</p>

                  <h5 className="text-info mt-4">Additional Notes</h5>
                  <ul>
                    <li>AI model still under development.</li>
                    <li>Human evaluation required.</li>
                  </ul>
                </div>
              </div>
            </div>
            <p
              className="text-muted text-center mt-3"
              style={{ fontSize: "0.9rem" }}
            >
              You can download this report later from your profile .
            </p>

            {/* Buttons */}
            {/* <div className="d-flex justify-content-center gap-3 mt-4 no-print">
              <button className="btn btn-success" onClick={handleDownloadPDF}>
                <i className="bi bi-download me-2"></i>Download Report
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                <i className="bi bi-upload me-2"></i>Upload New Image
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
