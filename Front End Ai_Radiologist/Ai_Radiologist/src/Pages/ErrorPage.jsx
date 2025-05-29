import "../assets/Styling/ErrorPage.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="error-container text-center p-4">
        <h1 className="error-code mb-0 display-1 text-danger">404</h1>
        <h2 className="display-6 error-message mb-3">Page Not Found</h2>
        <p className="lead error-message mb-5">
          We can't seem to find the page you're looking for.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link
            to="/AI_Radiologist"
            className="btn btn-outline-secondary px-4 py-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
