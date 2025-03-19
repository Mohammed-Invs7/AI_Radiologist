import Image1 from "../assets/Images/arrow,background.png"
import { useNavigate } from "react-router-dom"
import "../assets/Styling/Upload_Button.css"

const UploadButton = () => {
    const navigate = useNavigate();
    
    const handleUploadClick = () => {
        const token = localStorage.getItem("token");

        if (token) {
            console.log("Navigating to /upload_page");
            navigate('/Upload');
        } else {
            console.log("Redirecting to /login");
            navigate('/login');
        }
    };
    return (
        <div className="mt-4" style={{position:"relative"}}>
            <img id="arrow"  src={Image1} alt="" />
            { <button className="btn-Upload" /*style={{background:"#017276" , color:"white" ,fontWeight:"400" , border:"none", padding:"5px", borderRadius:"20px"}}*/ onClick={handleUploadClick}>Upload Your Radiology  Image</button> }
        </div>
    );
};

export default UploadButton;