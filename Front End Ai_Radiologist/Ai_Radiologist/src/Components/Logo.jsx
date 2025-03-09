import { Link } from "react-router-dom";
import logoNav from"../assets/Images/LOGO_NAV.png"

const Logo = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                 {/* Website logo */}
                <Link className="" to="/">
                    <img style={{width:"150px"}} src={logoNav} alt="" />
                </Link>
        </div>
</nav>
    );
};

export default Logo;