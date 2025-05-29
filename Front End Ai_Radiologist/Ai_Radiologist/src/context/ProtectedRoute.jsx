import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types"; 

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); 

    // Display a loading screen while authentication status is being checked
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    // Redirect to login page if the user is not authenticated
    if (!user) {
        return <Navigate to="/AI_Radiologist/login" replace />;
    }

    // Render the protected component if the user is authenticated
    return children;
};

// Define prop types for validation
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
