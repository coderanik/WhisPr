"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ToastContextType {
  showToast: (msg: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 text-white ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export default function Toast() { return null; } 