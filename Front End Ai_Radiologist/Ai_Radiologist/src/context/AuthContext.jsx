import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("Token from localStorage on page load:", token);
    console.log("User data from localStorage:", userData);

    if (token && userData) {
        try {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);

            // التحقق من user_type عند تحميل الصفحة
            if (parsedUserData.user_type !== 'admin') {
                console.warn("User type is not admin, current type is:", parsedUserData.user_type);
            }

        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }

    setLoading(false);
}, []);


    const login = async (token, userData) => {
    console.log("Storing Token:", token);
    console.log("User Data from API:", userData); // طباعة بيانات المستخدم هنا
    
    try {
        if (userData.user_type !== 'admin') {
            console.warn("User type is not admin. Check your database or response from API.");
        }

        // تخزين التوكن وبيانات المستخدم في localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);  // تحديث الحالة
    } catch (error) {
        console.error("Error storing token or user data:", error);
    }
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
