import {Link} from "react-router-dom";

const Logo = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                 {/* Website logo */}
                <Link className="navbar-brand fw-bold logo " to="/">
                    AI-Radiologist
                </Link>
        </div>
</nav>
    );
};

export default Logo;