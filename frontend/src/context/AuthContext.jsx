import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const parseResponseBody = async (res) => {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  };

  const getErrorMessage = (data, fallback) => {
    if (data && typeof data === "object" && data.message) {
      return data.message;
    }
    return fallback;
  };

  // Check if user is already logged in
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await parseResponseBody(res);
      if (!res.ok) {
        setAuthUser(null);
        return;
      }
      setAuthUser(data);
    } catch (error) {
      console.log("Error in checkAuth:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signup = async (formData) => {
    setIsSigningUp(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(getErrorMessage(data, "Signup failed"));

      setAuthUser(data);
      toast.success("Signup successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (formData) => {
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(getErrorMessage(data, "Login failed"));

      setAuthUser(data);
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthUser(null);
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed");
    }
  };

  const updateProfile = async (profileData) => {
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/auth/Update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(getErrorMessage(data, "Update failed"));

      setAuthUser(data);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const value = {
    authUser,
    isSigningUp,
    isLoggingIn,
    isUpdatingProfile,
    isCheckingAuth,
    signup,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
