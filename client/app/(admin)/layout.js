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
          width: "240px",
          borderRight: "1px solid var(--cal-border-subtle)",
          background: "var(--cal-bg)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
               <div style={{ 
                 width: "28px", height: "28px", background: "var(--cal-brand)", 
                 borderRadius: "6px", display: "flex", alignItems: "center", 
                 justifyContent: "center", color: "white", fontSize: "14px", fontWeight: 800 
               }}>C</div>
               <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>CalClone</span>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px" }}>
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  marginBottom: "2px",
                  fontSize: "13px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 500,
                  color: isActive ? "var(--cal-text-emphasis)" : "var(--cal-text-subtle)",
                  background: isActive ? "var(--cal-bg-muted)" : "transparent",
                  transition: "all var(--transition-fast)",
                }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div style={{ padding: "20px", borderTop: "1px solid var(--cal-border-subtle)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", background: "var(--cal-bg-subtle)", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px", fontWeight: 500 }}>Default User</span>
             </div>
          </div>
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
