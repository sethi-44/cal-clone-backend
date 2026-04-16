export function Skeleton({ width = "100%", height = "20px", borderRadius = "4px", style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
        ...style
      }}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <div style={{
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      padding: "20px",
      background: "var(--color-bg-primary)",
    }}>
      <div style={{ height: "4px", background: "var(--color-bg-tertiary)", borderRadius: "2px", marginBottom: "16px", width: "100%", top: 0, position: "absolute", left: 0 }} />
      <Skeleton width="60%" height="20px" />
      <div style={{ height: "8px" }} />
      <Skeleton width="40%" height="14px" />
      <div style={{ height: "16px" }} />
      <Skeleton width="30%" height="14px" />
    </div>
  );
}
