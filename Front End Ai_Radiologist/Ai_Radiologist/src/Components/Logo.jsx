import { Link } from "react-router-dom";
import logoNav from "../assets/Images/LOGO_NAV.png";

const Logo = () => {
  return (
    <nav className="navbar navbar-light bg-light p-0">
      <div className="container">
        {/* Website logo */}
        <Link className="" to="/AI_Radiologist">
          <img style={{ width: "150px" }} src={logoNav} alt="" />
        </Link>
      </div>
    </nav>
  );
};

export default Logo;
