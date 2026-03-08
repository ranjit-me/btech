import { createContext, useContext, useState } from "react";
import { setTokens, clearTokens, authAPI } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Login with JWT tokens (email/password backend login)
  const login = (userData, tokens = null) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (tokens) {
      setTokens(tokens);
    }
  };

  // Google OAuth login – user data decoded from Google token
  const loginWithGoogle = (userData) => {
    // For Google OAuth we store the user data locally (no backend JWT required
    // since backend auth endpoints use email/password JWT; Google login stays
    // as a local-only auth mechanism for now)
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {
      // ignore errors on logout
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userProfileData");
    localStorage.removeItem("dynamicRoadmap");
    localStorage.removeItem("completed");
    clearTokens();
  };

  // Update stored user (e.g., after fetching /auth/me/)
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
