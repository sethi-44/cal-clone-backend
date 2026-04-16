"use client";

import { useState, useCallback, createContext, useContext } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 9999,
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "var(--shadow-lg)",
            animation: "slideInRight 0.3s ease-out",
            background: toast.type === "success" ? "#ecfdf5" : toast.type === "error" ? "#fef2f2" : "var(--color-bg-primary)",
            color: toast.type === "success" ? "#065f46" : toast.type === "error" ? "#991b1b" : "var(--color-text-primary)",
            border: `1px solid ${toast.type === "success" ? "#a7f3d0" : toast.type === "error" ? "#fecaca" : "var(--color-border)"}`,
          }}>
            {toast.type === "success" ? "✓ " : toast.type === "error" ? "✕ " : ""}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
