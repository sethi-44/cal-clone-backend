"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/Toast";

const navItems = [
  { href: "/", label: "Event Types", icon: "📅" },
  { href: "/dashboard", label: "Bookings", icon: "📋" },
  { href: "/availability", label: "Availability", icon: "🕐" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{
          width: "var(--sidebar-width)",
          borderRight: "1px solid var(--color-border)",
          background: "var(--color-bg-primary)",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            padding: "0 24px 24px",
            borderBottom: "1px solid var(--color-border)",
            marginBottom: "16px",
          }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              ⚡ CalClone
            </h1>
          </div>

          <nav style={{ flex: 1 }}>
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  background: isActive ? "var(--color-bg-tertiary)" : "transparent",
                  borderRight: isActive ? "2px solid var(--color-brand)" : "2px solid transparent",
                  transition: "var(--transition-fast)",
                }}>
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: "32px 40px",
          maxWidth: "960px",
          overflowY: "auto",
        }}>
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
