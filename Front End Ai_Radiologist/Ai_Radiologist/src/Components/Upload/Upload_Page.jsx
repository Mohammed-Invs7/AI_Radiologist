import { useState } from "react"; 
import { useAuth } from "../../context/AuthContext"; 
import axios from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; 
import Image1 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/image-upload.png"; 
import Image2 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/spark, sparkle, 29.png"; 
import Image3 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/spark, sparkle, 28.png"; 
import Image4 from "/Front End Ai_Radiologist/Ai_Radiologist/src/assets/arrow, hand drawn, scribble, doodle, 12.png"; 
import "./Upload.css"; 
import NavBar from "../NavBar/NavBar"; 

const API_URL = "http://localhost:5000/predict"; // Define the API URL

const Upload_Page = () => { 
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth(); // Retrieve user authentication state

  const [formData, setFormData] = useState({ 
    file: null, // Stores the selected file
    fileName: "No file chosen", // Default text for file input
    imagePreview: null, // Stores the image preview URL
    type: "", // Stores the selected image type
    bodyPart: "", // Stores the selected body part
    loading: false, // Indicates if the upload is in progress
    predictionResult: null, // Stores the AI prediction result
  }); 

  const handleFileChange = (event) => { 
    const selectedFile = event.target.files[0]; // Get the selected file
    if (selectedFile) { 
      setFormData({ 
        ...formData, 
        file: selectedFile, // Update the file state
        fileName: selectedFile.name, // Update file name
        imagePreview: URL.createObjectURL(selectedFile), // Generate a preview URL
        predictionResult: null, // Reset previous prediction result
      }); 
    } 
  }; 

  const handleChange = (event) => { 
    setFormData({ ...formData, [event.target.name]: event.target.value }); // Update input fields in the state
  }; 

  const handleSubmit = async (event) => { 
    event.preventDefault(); // Prevent the default form submission behavior

    if (!formData.file || !formData.type || !formData.bodyPart) { 
      alert("Please select all required fields."); // Display an alert if required fields are missing
      return; 
    } 

    try { 
      setFormData((prev) => ({ ...prev, loading: true, predictionResult: null })); // Set loading state to true

      const uploadData = new FormData(); // Create a FormData object for file upload
      uploadData.append("image", formData.file); // Append the image file
      uploadData.append("type", formData.type); // Append the image type
      uploadData.append("body_part", formData.bodyPart); // Append the body part

      const response = await axios.post(API_URL, uploadData, { 
        headers: { "Accept": "application/json" } // Set the request headers
      }); 

      if (response.status === 200) { 
        setFormData((prev) => ({ 
          ...prev, 
          predictionResult: response.data.prediction, // Store the AI prediction result
          loading: false, // Reset loading state
        })); 
      } else { 
        throw new Error(response.statusText || "Prediction failed"); // Handle unsuccessful requests
      } 
    } catch (error) { 
      setFormData((prev) => ({ 
        ...prev, 
        predictionResult: `Error: ${error.response?.data?.error || error.message}`, // Store the error message
        loading: false, // Reset loading state
      })); 
    } 
  }; 

  return ( 
    <div> 
      <NavBar /> {/* Display the navigation bar */}
      <img src={Image2} alt="Upload" className="upload-icon2" /> 
      <img src={Image3} alt="Upload" className="upload-icon3" /> 

      <div className="upload-container d-flex flex-column align-items-center"> 
        <div className="upload-box d-flex flex-column align-items-center mt-5"> 
          <h3 className="upload-header">Upload Your Image</h3> 

          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center"> 
            <img src={formData.imagePreview || Image1} alt="Preview" className={formData.imagePreview ? "upload-preview" : "upload-icon1"} /> {/* Display selected image preview */}

            <input type="file" id="file-input" hidden onChange={handleFileChange} accept="image/*" /> {/* File input */}
            <label htmlFor="file-input" className="upload-label">Choose File</label> 
            <span className="file-name">{formData.fileName}</span> {/* Display selected file name */}

            <select name="type" value={formData.type} onChange={handleChange} className="upload-select"> {/* Select image type */}
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

            <img src={Image4} alt="Upload" className={`upload-icon4 ${formData.imagePreview ? "image-uploaded" : ""}`} /> {/* Display arrow icon */}

            <button type="submit" className="upload-button" disabled={formData.loading}> {/* Upload button */}
              {formData.loading ? "Processing..." : "Upload"} 
            </button> 

            {formData.loading && ( 
              <div className="text-center mt-3"> 
                <div className="spinner-border text-primary" role="status"> 
                  <span className="visually-hidden">Uploading...</span> {/* Loading spinner */}
                </div> 
              </div> 
            )} 

            {formData.predictionResult && ( 
              <div className="result-box mt-3"> 
                <h5>AI Prediction:</h5> 
                <p>{formData.predictionResult}</p> {/* Display AI prediction result */}
              </div> 
            )} 
          </form> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default Upload_Page; 
