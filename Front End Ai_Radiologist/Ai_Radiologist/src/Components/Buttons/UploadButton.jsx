import { useNavigate } from "react-router-dom"

const UploadButton = () => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        console.log("Navigating to /Upload_Page");
        navigate('/Upload_Page');
    };
    return (
        <div>
            <button onClick={handleClick}>Upload</button>
        </div>
    );
};

export default UploadButton;