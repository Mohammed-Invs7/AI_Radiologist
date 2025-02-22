import {useNavigate } from "react-router-dom"

const RegistrationButton = () => {
    const navigate = useNavigate ();
    
    const handleClick = () => {
        console.log("Navigating to /register");
        navigate('/Registration');
    };
    return (
        <button onClick={handleClick}>Registr</button>
    );
};

export default RegistrationButton;