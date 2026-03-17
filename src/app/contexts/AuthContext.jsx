import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@features/auth/api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user'); 
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      
      const data = response.data;

      const accessToken = data.token; 
      const refreshToken = data.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const profileResponse = await authApi.getProfile();
      const profile = profileResponse.data;

      const userRoles = data.roles ? data.roles.map(role => role.name) : [];

      localStorage.setItem("user", JSON.stringify(profile)); 

      setIsAuthenticated(true);
      setUser(profile);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || "Ошибка входа"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);