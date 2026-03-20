import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginUser, registerUser, getMe } from "../services/authService";
import { setAuthToken } from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      setAuthToken(token);

      try {
        const response = await getMe();
        setUser({
          ...response.user,
          token
        });
      } catch (error) {
        localStorage.removeItem("token");
        setAuthToken("");
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (payload) => {
    const response = await loginUser(payload);
    localStorage.setItem("token", response.token);
    setAuthToken(response.token);
    setUser({
      ...response.user,
      token: response.token
    });
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    localStorage.setItem("token", response.token);
    setAuthToken(response.token);
    setUser({
      ...response.user,
      token: response.token
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      register,
      logout,
      isAuthLoading
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
