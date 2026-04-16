export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
          animation: "fadeIn 0.15s ease-out",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "var(--color-bg-primary)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        zIndex: 1000,
        width: "90%",
        maxWidth: "440px",
        boxShadow: "var(--shadow-lg)",
        animation: "scaleIn 0.2s ease-out",
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {title}
        </h2>
        {children}
        {actions && (
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "24px",
          }}>
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
