import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getMe,
  loginRoleUser,
  loginUser,
  registerHostelOwnerUser,
  registerStudentUser,
  registerUser,
  verifyOtpCode
} from "../services/authService";
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

  const loginWithRole = async (payload) => {
    const response = await loginRoleUser(payload);
    localStorage.setItem("token", response.token);
    setAuthToken(response.token);
    setUser({
      ...response.user,
      token: response.token
    });
    return response;
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

  const registerStudent = async (payload) => {
    return registerStudentUser(payload);
  };

  const registerHostelOwner = async (payload) => {
    return registerHostelOwnerUser(payload);
  };

  const verifyOtp = async (payload) => {
    const response = await verifyOtpCode(payload);
    localStorage.setItem("token", response.token);
    setAuthToken(response.token);
    setUser({
      ...response.user,
      token: response.token
    });
    return response;
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
      loginWithRole,
      register,
      registerStudent,
      registerHostelOwner,
      verifyOtp,
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
