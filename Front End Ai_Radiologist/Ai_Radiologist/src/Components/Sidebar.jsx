import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LogoSidebar from "../assets/Images/Logo.png";
import "../assets/Styling/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [slideOut, setSlideOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // تحقق من مسار التسجيل بناءً على الهيكل الجديد
  const isRegisterPage = location.pathname === "/AI_Radiologist/Registration";
  const buttonText = isRegisterPage ? "Login" : "Register";
  const welcomeText = isRegisterPage ? "Welcome" : "Welcome Back";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setSlideOut(true);
    setTimeout(() => {
      navigate(
        isRegisterPage
          ? "/AI_Radiologist/Login"
          : "/AI_Radiologist/Registration"
      );
    }, 600);
  };

  return (
    <div
      className={`sidebar-box ${mounted ? "slide-in" : ""} ${
        slideOut ? "slide-out" : ""
      }`}
    >
      <div className="sidebar-panel d-flex flex-column justify-content-center align-items-center">
        <h1>{welcomeText}</h1>
        <Link to="/AI_Radiologist">
          <img className="img-logo" width={250} src={LogoSidebar} alt="Logo" />
        </Link>
        <p className="text-center">
          At Your Service For <br />
          Better Health
        </p>
        <button
          className="btn register-btn fw-bold"
          style={{ color: "white" }}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
