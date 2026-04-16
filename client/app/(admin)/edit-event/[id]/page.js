"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.getEventById(id)
      .then(data => setForm({
        ...data,
        description: data.description || "",
      }))
      .catch(err => {
        addToast(err.message, "error");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [id, router, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateEvent(id, {
        ...form,
        duration: Number(form.duration),
        bufferTime: Number(form.bufferTime),
      });
      addToast("Event updated");
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

  if (loading) {
    return <div style={{ maxWidth: "560px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <Skeleton height="32px" width="40%" />
      <Skeleton height="400px" borderRadius="var(--radius-lg)" />
    </div>;
  }

  if (!form) return null;

  return (
    <div style={{ maxWidth: "560px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
        ← Back
      </button>

      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
        Edit Event
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
              <input required type="text" value={form.slug} pattern="^[a-z0-9-]+$" title="Lowercase letters, numbers, and dashes only"
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
