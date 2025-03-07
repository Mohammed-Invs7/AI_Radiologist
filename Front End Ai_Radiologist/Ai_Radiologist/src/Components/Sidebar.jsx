import { Link } from "react-router-dom";
import "../assets/Styling/Sidebar.css"
const Sidebar = () => {
    return (
        <div className="sidebar-box ">
            <div className="sidebar-panel sidebar-lift">
                <h1>Welcome</h1>
                <h2>AI Radiologist</h2>
                <p>At Your Service For Better Health</p>
                <Link>
                    <button className="btn register-btn">
                        Register
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default Sidebar; 
