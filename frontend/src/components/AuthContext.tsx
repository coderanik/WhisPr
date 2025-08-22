"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiPost } from "@/utils/api";
import { useToast } from "./Toast";

interface AuthContextType {
  user: { name: string } | null;
  token: string | null;
  login: (name: string, regNo: string, password: string) => Promise<void>;
  register: (name: string, regNo: string, password: string) => Promise<void>;
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
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
  }, []);

  const login = async (name: string, regNo: string, password: string) => {
    try {
      const res = await apiPost("/api/auth/login", { name,regNo, password });
      setUser({ name: res.name });
      setToken(res.token);
      localStorage.setItem("auth", JSON.stringify({ user: { name: res.name }, token: res.token }));
      showToast("Logged in!", "success");
    } catch (err: any) {
      showToast(err.message || "Login failed", "error");
      throw err;
    }
  };

  const register = async (name: string, regNo: string, password: string) => {
    try {
      await apiPost("/api/auth/register", { name, regNo, password });
      showToast("Registered! Please login.", "success");
    } catch (err: any) {
      showToast(err.message || "Registration failed", "error");
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
    showToast("Logged out", "success");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 