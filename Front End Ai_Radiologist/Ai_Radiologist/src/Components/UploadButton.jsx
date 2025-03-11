import Image1 from "../assets/Images/arrow,background.png"
import { useNavigate } from "react-router-dom"

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
            <img width={"100px"} style={{ position: " absolute" , bottom:"-66%", left:"107%"}} src={Image1} alt="" />
            <button style={{background:"#017276" , color:"white" ,fontWeight:"400" , border:"none", padding:"5px", borderRadius:"20px"}} onClick={handleUploadClick}>Upload Your Radiology  Image</button>
        </div>
    );
};

export default UploadButton;