import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@features/auth/api/authApi";
import { setAccessToken } from "@/shared/api/axiosInstance";


const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const initAuth = async () => {
    try {
      const refreshResponse = await authApi.refreshToken();
      const newToken =
        refreshResponse.data.accessToken || refreshResponse.data.token;

      if (newToken) {
        setAccessToken(newToken);
        setIsAuthenticated(true);

        authApi
          .getProfile()
          .then((profileResponse) => {
            setUser(profileResponse.data);
          })
          .catch((err) => {
            console.error("Profile load error:", err);
          });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Init auth error:", error);
      }

      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const accessToken = response.data.accessToken || response.data.token;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      setAccessToken(accessToken);
      
      const profileResponse = await authApi.getProfile();
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Ошибка входа"
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
    }
    
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
};

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};