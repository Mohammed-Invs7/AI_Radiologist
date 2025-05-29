import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>; 

    if (!user || user.user_type !== "admin") {
        return <Navigate to="/AI_Radiologist/Login" />;
    }

    return <Outlet />;
};

export default AdminRoute;
