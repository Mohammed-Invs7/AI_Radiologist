import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                setUser(parsedUserData);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }

        setLoading(false);
    }, []);

    const login = async (token, userData) => {
        try {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Error storing token or user data:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
