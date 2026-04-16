import Link from "next/link";

export default function EmptyState({ icon = "📅", title, description, action }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "60px 20px",
      color: "var(--color-text-secondary)",
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "14px", marginBottom: "24px", maxWidth: "320px", margin: "0 auto 24px" }}>
        {description}
      </p>
      {action}
    </div>
  );
}
