import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
            setIsLoading(false);
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((data) => {
          if (data) {
            setUser({ id: data.id, name: data.name, email: data.email });
          } else {
            setUser(null);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!res.ok) {
        setIsLoading(false);
        return { error: "Invalid email or password" };
      }
      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      // Fetch user info
      const userRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const userData = await userRes.json();
      setUser({ id: userData.id, name: userData.name, email: userData.email });
      setIsLoading(false);
      return {};
    } catch (e) {
      setIsLoading(false);
      return { error: "Login failed" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        setIsLoading(false);
        const data = await res.json();
        return { error: data.detail || "Signup failed" };
      }
      // Auto-login after signup
      const loginRes = await login(email, password);
      setIsLoading(false);
      return loginRes;
    } catch (e) {
      setIsLoading(false);
      return { error: "Signup failed" };
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
