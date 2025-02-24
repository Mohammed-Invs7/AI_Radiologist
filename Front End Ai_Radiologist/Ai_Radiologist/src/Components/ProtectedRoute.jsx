import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Get user authentication state and loading status

    // While loading data, do not redirect
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    // After loading is complete, check if the user exists
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children; // Render the protected component if the user is authenticated
};

export default ProtectedRoute;
