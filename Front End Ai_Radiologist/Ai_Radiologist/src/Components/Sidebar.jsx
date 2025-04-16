import { useState } from "react";
import { useNavigate, useLocation , Link } from "react-router-dom";
import LogoSidebar from "../assets/Images/Logo.png"
import "../assets/Styling/Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [slideOut, setSlideOut] = useState(false);

    const isRegisterPage = location.pathname === "/Registration";
    const buttonText = isRegisterPage ? "Login" : "Register";
    const welcomeText = isRegisterPage ? "Welcome" : "Welcome Back";

    const handleClick = () => {
        setSlideOut(true); 
        setTimeout(() => {
            navigate(isRegisterPage ? "/Login" : "/Registration");
        }, 600); 
    };

    return (
        <div className={`sidebar-box ${slideOut ? "slide-out" : ""}`}>
            <div className="sidebar-panel d-flex flex-column justify-content-center align-items-center">
                <h1>{welcomeText}</h1>
                <Link to="/">
                    <img className="img-logo" width={250} src={LogoSidebar} alt="" />
                </Link>
                <p className="text-center">At Your Service For <br />Better Health</p>
                <button style={{color:"white"}} className="btn register-btn fw-bold  " onClick={handleClick}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
