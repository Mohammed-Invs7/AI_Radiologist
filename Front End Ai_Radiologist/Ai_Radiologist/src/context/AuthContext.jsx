import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => { 
        const token = localStorage.getItem("token"); 
        if (token) { 
            setUser({ token }); 
        } 
        setLoading(false); 
    }, []); 

    const login = (token) => { 
        localStorage.setItem("token", token); 
        setUser({ token }); 
    }; 

    const logout = () => { 
        localStorage.removeItem("token"); 
        setUser(null); 
    }; 

    return ( 
        <AuthContext.Provider value={{ user, login, logout, loading }}> 
            {children} 
        </AuthContext.Provider> 
    ); 
}; 

//  Define PropTypes for AuthProvider
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensures children prop is provided
};

export const useAuth = () => useContext(AuthContext); 
