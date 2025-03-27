import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => { 
        const token = localStorage.getItem("token"); 
        const userData = localStorage.getItem("user");

        console.log("Token from localStorage on page load:", token); // Log token

        if (token && userData) { 
            setUser(JSON.parse(userData)); 
        } 

        setLoading(false); 
    }, []); 

    const login = async (token, userData) => { 
        console.log("Storing Token:", token);
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
    }; 

    const logout = () => { 
        console.log("Logging out with Token:", localStorage.getItem("token"));

        localStorage.removeItem("token");
        localStorage.removeItem("user"); 
        setUser(null); 
    }; 

    const updateUser = (updatedUserData) => {
        console.log("Updating User Data:", updatedUserData);
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
