import Gmail from '../../assets/Images/gmail.png'
import Twitter from "../../assets/Images/twitter (1).png";
import Instagram from "../../assets/Images/instagram.png";
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <div className="text-center p-4 bg-light mt-5">
      <h2 className="fw-bold mb-3">
        Innovative AI-Powered Technology for Better Healthcare.
      </h2>
      <p className="mb-4 fs-5">
        Save time and costs with instant results—no hospital visits required.
      </p>
      <div className="d-flex justify-content-center gap-5">
        <Link to={"/AI_Radiologist"}>
          <img src={Instagram} alt="Instagram" width="40" />
        </Link>
        <Link to={"/AI_Radiologist"}>
          <img src={Gmail} alt="Email" width="40" />
        </Link>
        <Link to={"/AI_Radiologist"}>
          <img src={Twitter} alt="X (Twitter)" width="40" />
        </Link>
      </div>
    </div>
  );
};

export default Footer