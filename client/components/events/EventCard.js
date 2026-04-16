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
    <div className="card" style={{
      position: "relative",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      cursor: "pointer",
    }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
          {event.title}
        </h3>
        <span style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-text-tertiary)",
        }}>
          {event.duration}m
        </span>
      </div>

      <p style={{ 
        fontSize: "14px", 
        color: "var(--color-text-tertiary)", 
        marginBottom: "16px",
        lineHeight: "1.5",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {event.description || "No description set for this event type."}
      </p>

      <div style={{
        fontSize: "13px",
        color: "var(--color-text-tertiary)",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}>
        <span style={{ opacity: 0.5 }}>calclone.com/</span>
        <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{event.slug}</span>
      </div>
      
      <div style={{ flex: 1 }} />

      <div style={{
        display: "flex",
        gap: "8px",
        paddingTop: "16px",
        borderTop: "1px solid var(--color-border-subtle)",
        alignItems: "center"
      }}>
        <button onClick={copyLink} style={{
          fontSize: "13px",
          fontWeight: 600,
          color: copied ? "var(--color-success)" : "var(--color-text-primary)",
          background: "var(--color-bg-primary)",
          border: "1px solid var(--color-border)",
          padding: "6px 12px",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          flex: 1,
          transition: "var(--transition-fast)",
        }}>
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <Link href={`/book/${event.slug}`} target="_blank"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            textAlign: "center",
            flex: 1,
            transition: "var(--transition-fast)",
        }}>
          Preview
        </Link>

        <Link href={`/edit-event/${event.id}`} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-border)",
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          transition: "var(--transition-fast)",
        }} title="Edit">
          ⚙️
        </Link>
      </div>
    </div>
  );
}
