import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext();
const API_TOKEN = `${BASE_URL}/auth/token/refresh/`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const localToken = localStorage.getItem("token");
      const localRefresh = localStorage.getItem("refreshToken");
      const localUser = localStorage.getItem("user");

      if (localToken && localRefresh) {
        setToken(localToken);
        setRefreshToken(localRefresh);

        if (localUser) {
          setUser(JSON.parse(localUser));
        }

        if (!isTokenValid(localToken)) {
          await refreshAccessToken(localRefresh);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch (err) {
      return false;
    }
  };

  const refreshAccessToken = async (refreshTokenParam) => {
    try {
      const response = await axios.post(`${API_TOKEN}`, {
        refresh: refreshTokenParam,
      });
      const newAccessToken = response.data.access;
      setToken(newAccessToken);
      localStorage.setItem("token", newAccessToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  const login = async (newToken, userData, newRefreshToken) => {
    try {
      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
    } catch (error) {
      console.error("Error storing token or user data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  const updateUser = (updatedUserData) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
