"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "../ui/Toast";

const EVENT_COLORS = [
  "#4f46e5", "#0891b2", "#059669", "#d97706",
  "#dc2626", "#7c3aed", "#be185d", "#0d9488",
];

export default function EventCard({ event, onEdit, onDelete, colorIndex = 0 }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const color = EVENT_COLORS[colorIndex % EVENT_COLORS.length];
  const bookingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/book/${event.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      addToast("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast("Failed to copy link", "error");
    }
  };

  return (
    <div style={{
      position: "relative",
      background: "var(--color-bg-primary)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      transition: "var(--transition-base)",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: color }} />

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-primary)" }}>
              {event.title}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>
              {event.description || "No description"}
            </p>
          </div>
          <span style={{
            fontSize: "12px",
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: "20px",
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text-secondary)",
            whiteSpace: "nowrap",
          }}>
            {event.duration} min
          </span>
        </div>

        <p style={{
          fontSize: "13px",
          color: "var(--color-text-tertiary)",
          fontFamily: "monospace",
          marginBottom: "16px",
        }}>
          /{event.slug}
        </p>
        
        <div style={{ flex: 1 }} />

        <div style={{
          display: "flex",
          gap: "8px",
          paddingTop: "16px",
          borderTop: "1px solid var(--color-border)",
          alignItems: "center"
        }}>
          <Link href={`/book/${event.slug}`} target="_blank"
            style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              transition: "var(--transition-fast)",
              background: "var(--color-bg-primary)",
          }}>
            Preview
          </Link>

          <button onClick={copyLink} style={{
            fontSize: "13px",
            color: copied ? "var(--color-success)" : "var(--color-text-secondary)",
            background: "transparent",
            border: "1px solid var(--color-border)",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            transition: "var(--transition-fast)",
          }}>
            {copied ? "✓ Copied" : "Copy Link"}
          </button>

          <div style={{ flex: 1 }} />

          <Link href={`/edit-event/${event.id}`} style={{
            fontSize: "13px",
            color: "var(--color-text-secondary)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
            textDecoration: "none"
          }}>
            Edit
          </Link>

          <button onClick={() => onDelete(event)} style={{
            fontSize: "13px",
            color: "var(--color-error)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
