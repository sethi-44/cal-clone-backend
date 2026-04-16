"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function CreateEventPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 30,
    slug: "",
    bufferTime: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createEvent({
        ...form,
        duration: Number(form.duration),
        bufferTime: Number(form.bufferTime),
      });
      addToast("Event type created");
      router.push("/");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)", fontSize: "14px", marginTop: "6px", fontFamily: "inherit"
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
        ← Back
      </button>

      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
        Add Event Type
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: "var(--color-bg-primary)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", fontWeight: 500 }}>Event Title</label>
            <input required type="text" value={form.title} placeholder="e.g. 30 Min Meeting"
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", fontWeight: 500 }}>URL Slug</label>
            <div style={{ display: "flex", alignItems: "center", marginTop: "6px" }}>
              <span style={{ padding: "10px", background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)", borderRight: "none", borderRadius: "var(--radius-md) 0 0 var(--radius-md)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
                /book/
              </span>
              <input type="text" value={form.slug} placeholder="Leave blank to auto-generate" pattern="^[a-z0-9-]+$" title="Lowercase letters, numbers, and dashes only"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                style={{ ...inputStyle, marginTop: 0, borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", fontWeight: 500 }}>Description</label>
            <textarea value={form.description} rows={3} placeholder="Write a summary and any details your invitee should know about the meeting."
              onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "14px", fontWeight: 500 }}>Duration (min)</label>
              <input required type="number" min={5} max={480} value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} style={inputStyle}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "14px", fontWeight: 500 }}>Buffer Time</label>
              <select value={form.bufferTime} onChange={(e) => setForm({ ...form, bufferTime: e.target.value })} style={inputStyle}>
                <option value={0}>No buffer</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button type="button" onClick={() => router.back()} style={{ padding: "10px 16px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} style={{ padding: "10px 24px", background: "var(--color-brand)", color: "white", border: "none", borderRadius: "var(--radius-md)", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}