import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(); // Create authentication context

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store authenticated user
    const [loading, setLoading] = useState(true); // State to track authentication loading status

    useEffect(() => {
        // Retrieve user token from localStorage when the app starts
        const token = localStorage.getItem("token");

        if (token) {
            // Set the user if a token exists
            setUser({ token });
        }

        // Mark loading as complete after checking localStorage
        setLoading(false);
    }, []);

    const login = (token) => {
        // Store token in localStorage
        localStorage.setItem("token", token);
        // Set user state with token
        setUser({ token });
    };

    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Clear user state
        setUser(null);
    };

    return (
        // Provide user state and authentication functions to the entire app
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // Custom hook to use authentication context
