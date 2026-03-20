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

      if (!document.cookie.includes('refreshToken')) {
      setLoading(false);
      return;
    }

      try {
        console.log("=== INIT AUTH ===");

        const res = await authApi.refreshToken(); 
        const newToken = res.data.accessToken;

        console.log("INIT TOKEN:", newToken);

        setAccessToken(newToken);

        const profileResponse = await authApi.getProfile();
        const profile = profileResponse.data;

        setUser(profile);
        setIsAuthenticated(true);

      } catch (error) {
        console.log("No active session");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("=== LOGIN START ===");

      const response = await authApi.login({ email, password });
      const data = response.data;

      const accessToken = data.token;

      setAccessToken(accessToken);

      const profileResponse = await authApi.getProfile();
      const profile = profileResponse.data;

      setIsAuthenticated(true);
      setUser(profile);

      return { success: true };

    } catch (error) {
      console.error("LOGIN ERROR:", error);

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
    if (e.response?.status !== 401) {
      console.error("LOGOUT ERROR:", e);
    }
  }
  setAccessToken(null);
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