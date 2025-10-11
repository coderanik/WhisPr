"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiPost } from "@/utils/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: { anonymousName: string } | null;
  token: string | null;
  login: (regNo: string, password: string) => Promise<void>;
  register: (regNo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ anonymousName: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
  }, []);

  const login = async (regNo: string, password: string) => {
    try {
      const res = await apiPost("/api/auth/login", { regNo, password });
      setUser({ anonymousName: res.anonymousName });
      setToken(res.token);
      localStorage.setItem("auth", JSON.stringify({ 
        user: { anonymousName: res.anonymousName }, 
        token: res.token 
      }));
      toast.success("Logged in!");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  const register = async (regNo: string, password: string) => {
    try {
      const res = await apiPost("/api/auth/register", { regNo, password });
      toast.success(`Registered successfully! Your anonymous name is: ${res.anonymousName}`);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiPost("/api/auth/logout", {});
    } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 