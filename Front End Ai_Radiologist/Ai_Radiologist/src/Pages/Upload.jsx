// import { useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Image1 from "../assets/Images/image-upload.png";
// import "../assets/Styling/Upload.css";
// import NavBar from "../Components/NavBar";

// const API_URL = "http://localhost:5000/predict";

// const Upload = () => {
//   const [formData, setFormData] = useState({
//     file1: null,
//     imagePreview1: null,
//     type: "",
//     bodyPart: "",
//     loading: false,
//     predictionResult: null,
//     errorMessage: null,
//   });

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFormData((prev) => ({
//         ...prev,
//         file1: selectedFile,
//         imagePreview1: URL.createObjectURL(selectedFile),
//         predictionResult: null,
//         errorMessage: null,
//       }));
//     }
//   };

//   const handleChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!formData.file1) {
//       setFormData((prev) => ({ ...prev, errorMessage: "Please upload an image" }));
//       return;
//     }

//     try {
//       setFormData((prev) => ({ ...prev, loading: true, predictionResult: null, errorMessage: null }));

//       const uploadData = new FormData();
//       uploadData.append("image1", formData.file1);
//       uploadData.append("type", formData.type);
//       uploadData.append("body_part", formData.bodyPart);

//       const response = await axios.post(API_URL, uploadData, {
//         headers: { Accept: "application/json" },
//       });

//       if (response.status === 200) {
//         setFormData((prev) => ({
//           ...prev,
//           predictionResult: response.data.prediction,
//           loading: false,
//         }));
//       } else {
//         throw new Error(response.statusText || "Prediction failed, please try again");
//       }
//     } catch (error) {
//       setFormData((prev) => ({
//         ...prev,
//         errorMessage: error.response?.data?.error || "An error occurred while uploading the image",
//         loading: false,
//       }));
//     }
//   };

//   return (
//     <div>
//       <NavBar />
//       <div className="upload-container d-flex flex-column align-items-center">
//         <div className="upload-box d-flex flex-column align-items-center mt-5">
//           <h3 className="upload-header">Upload Image</h3>

//           <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
//             <div className="image-preview-container">
//               <img src={formData.imagePreview1 || Image1} alt="Preview 1" className="upload-preview" />
//             </div>

//             <input
//               type="file"
//               id="file-input-1"
//               hidden
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//             <label htmlFor="file-input-1" className="upload-label">
//               Choose an image
//             </label>

//             <select name="type" value={formData.type} onChange={handleChange} className="upload-select">
//               <option value="">Select Type</option>
//               <option value="X-ray">X-ray</option>
//             </select>

//             <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="upload-select">
//               <option value="">Select Body Part</option>
//               <option value="Chest">Chest</option>
//             </select>

//             <button
//               type="submit"
//               className={`upload-button ${formData.loading || !formData.file1 || !formData.type || !formData.bodyPart ? "disabled-button" : "enabled"}`}
//               disabled={formData.loading || !formData.file1 || !formData.type || !formData.bodyPart}
//             >
//               {formData.loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Processing...
//                 </>
//               ) : (
//                 "Upload"
//               )}
//             </button>

//             {formData.errorMessage && <div className="alert alert-danger mt-3">{formData.errorMessage}</div>}

//             {formData.predictionResult && (
//               <div className="result-box mt-3">
//                 <h5>AI Prediction Result:</h5>
//                 <p>{formData.predictionResult}</p>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Upload;









import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image1 from "../assets/Images/image-upload.png";
import "../assets/Styling/Upload.css";
import NavBar from "../Components/NavBar";

const API_URL = "http://localhost:5000/predict";

const Upload = () => {
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
      setFormData((prev) => ({ ...prev, loading: true, predictionResult: null, errorMessage: null }));

      // محاكاة استجابة API وهمية
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          predictionResult: "Fake report generated", // مجرد مفتاح لتفعيل التقرير
          loading: false,
        }));
      }, 2000);
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        errorMessage: "An error occurred while uploading the image",
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

            <select name="type" value={formData.type} onChange={handleChange} className="upload-select">
              <option value="">X-ray Type</option>
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
            <h5 className="text-primary fw-bold mb-3">Technical Description</h5>
            <p>
              A chest X-ray was performed using a standard X-ray machine. The chest was imaged in both the anterior and posterior positions.
            </p>

            <h5 className="text-primary fw-bold mt-4">Results</h5>
            <ol>
              <li>
                <strong>Heart and Lungs.</strong>
                <ul>
                  <li>No obvious signs of heart enlargement or major issues with the lungs.</li>
                  <li>No immediate indications of rib fractures or abnormal calcifications.</li>
                </ul>
              </li>
              <li>
                <strong>Lung Tissue.</strong>
                <ul>
                  <li>The model may show some signs of minor changes in the left lung, but these findings are not confirmed.</li>
                </ul>
              </li>
              <li>
                <strong>Bones and Vessels.</strong>
                <ul>
                  <li>No clear indications of fractures or bone deformities.</li>
                </ul>
              </li>
            </ol>

            <h5 className="text-primary fw-bold mt-4">Clinical Interpretation:</h5>
            <p>
              The model demonstrates low accuracy in detecting minor changes in the lung tissue. Therefore, the results cannot be considered 100% accurate in this preliminary version. There may be false positives or false negatives.
            </p>

            <h5 className="text-primary fw-bold mt-4">Recommendations:</h5>
            <ol>
              <li>Further tests are required to verify the area indicated by the model in the left lung.</li>
              <li>Follow-up clinical evaluation with the physician is advised.</li>
            </ol>

            <h5 className="text-primary fw-bold mt-4">Confidence Level:</h5>
            <p>
              The confidence level in the results is around 70% based on the available data. It is recommended that this report be considered as part of a comprehensive examination.
            </p>

            <h5 className="text-primary fw-bold mt-4">Additional Notes:</h5>
            <ul>
              <li>This report is based on an AI model in development. The results may contain errors or warnings due to the preliminary version of the system.</li>
              <li>Human medical evaluation is still necessary to review the results.</li>
            </ul>

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
