import Image1 from "../assets/Images/arrow,background.png";
import { useNavigate } from "react-router-dom";
import "../assets/Styling/Upload_Button.css";

const UploadButton = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Navigating to /AI_Radiologist/Upload");
      navigate("/AI_Radiologist/Upload");
    } else {
      console.log("Redirecting to /AI_Radiologist/Login");
      navigate("/AI_Radiologist/Login");
    }
  };

  return (
    <div className="mt-4" style={{ position: "relative" }}>
      <img id="arrow" src={Image1} alt="" />
      <button className="btn-Upload" onClick={handleUploadClick}>
        Upload Your Radiology Image
      </button>
    </div>
  );
};

export default UploadButton;
