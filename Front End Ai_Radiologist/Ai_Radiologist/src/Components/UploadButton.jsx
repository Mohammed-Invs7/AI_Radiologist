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
        <div>
            <button onClick={handleUploadClick}>Upload</button>
        </div>
    );
};

export default UploadButton;