import {  useNavigate , useLocation } from "react-router-dom";
import "../assets/Styling/Sidebar.css"
const Sidebar = () => {
    const navigate  = useNavigate();
    const location = useLocation();
    
    const isRegisterPage = location.pathname === "/Registration";

    const buttonText = isRegisterPage ? "Login" : "Register";

    return (
        <div className="sidebar-box ">
            <div className="sidebar-panel sidebar-lift">
                <h1>Welcome</h1>
                <h2>AI Radiologist</h2>
                <p>At Your Service For Better Health</p>
                    <button
                        className="btn register-btn"
                        onClick={()=> navigate(isRegisterPage ? "/Login" : "/Registration")}
                    >
                        {buttonText}
                    </button>
            </div>
        </div>
    );
};
export default Sidebar; 
