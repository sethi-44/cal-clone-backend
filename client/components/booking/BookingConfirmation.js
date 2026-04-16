"use client";

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <div>
        <p style={{
          fontSize: "12px",
          color: "var(--color-text-tertiary)",
          margin: "0 0 2px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}>
          {label}
        </p>
        <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function BookingConfirmation({ booking, event, onBookAnother }) {
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (startStr, endStr) => {
    const s = new Date(startStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const e = new Date(endStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${s} – ${e} (${tz})`;
  };

  return (
    <div style={{
      maxWidth: "480px",
      margin: "0 auto",
      textAlign: "center",
      animation: "slideUp 0.3s ease-out"
    }}>
      <div style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        background: "#ecfdf5",
        color: "#10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
        fontSize: "28px",
      }}>
        ✓
      </div>

      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
        This meeting is scheduled
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
        We sent an email with a calendar invitation with the details to you and the participants.
      </p>

      <div style={{
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        textAlign: "left",
        marginBottom: "24px",
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {event.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <DetailRow icon="👤" label="What" value={event.title} />
          <DetailRow icon="📅" label="When" value={`${formatDate(booking.startTime)}, ${formatTime(booking.startTime, booking.endTime)}`} />
          <DetailRow icon="📝" label="Who" value={`${booking.name} (${booking.email})`} />
        </div>
      </div>

      <button
        onClick={onBookAnother}
        style={{
          padding: "10px 24px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          background: "var(--color-brand)",
          color: "var(--color-text-inverse)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          transition: "var(--transition-fast)",
        }}
      >
        Book another meeting
      </button>
    </div>
  );
}
