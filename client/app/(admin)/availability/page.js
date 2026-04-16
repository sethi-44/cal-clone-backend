"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const DAYS = [
  { label: "Sunday", short: "Sun", value: 0 },
  { label: "Monday", short: "Mon", value: 1 },
  { label: "Tuesday", short: "Tue", value: 2 },
  { label: "Wednesday", short: "Wed", value: 3 },
  { label: "Thursday", short: "Thu", value: 4 },
  { label: "Friday", short: "Fri", value: 5 },
  { label: "Saturday", short: "Sat", value: 6 },
];

const DEFAULT_TIME = { startTime: "09:00", endTime: "17:00" };

export default function AvailabilityPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Per-day schedule state
  const [schedule, setSchedule] = useState(Object.fromEntries(DAYS.map(d => [d.value, null])));

  // Initialize timezone from browser
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    api.getEvents().then(setEvents);
  }, []);

  // Load existing availability for selected event
  useEffect(() => {
    if (!selectedEventId) return;
    
    const loadAvail = async () => {
      setLoadingAvail(true);
      try {
        const data = await api.getAvailability(selectedEventId);
        
        const newSchedule = Object.fromEntries(DAYS.map(d => [d.value, null]));
        data.forEach(avail => {
          newSchedule[avail.dayOfWeek] = { startTime: avail.startTime, endTime: avail.endTime };
        });
        
        setSchedule(newSchedule);
        if (data.length > 0 && data[0].timezone) setTimezone(data[0].timezone);
      } catch (err) {
        addToast("Failed to load availability", "error");
      } finally {
        setLoadingAvail(false);
      }
    };
    
    loadAvail();
  }, [selectedEventId, addToast]);

  const toggleDay = (dayValue) => {
    setSchedule(prev => ({
      ...prev,
      [dayValue]: prev[dayValue] ? null : { ...DEFAULT_TIME },
    }));
  };

  const applyToAll = (sourceDay) => {
    const source = schedule[sourceDay];
    if (!source) return;
    setSchedule(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(d => { if (updated[d] !== null) updated[d] = { ...source }; });
      return updated;
    });
    addToast("Applied time to all enabled days");
  };

  const handleSave = async () => {
    const enabledDays = Object.entries(schedule).filter(([_, conf]) => conf !== null);
    
    if (enabledDays.length === 0) {
      addToast("Select at least one day", "error"); return;
    }

    const payload = enabledDays.map(([dayVal, conf]) => ({
      eventTypeId: selectedEventId,
      dayOfWeek: Number(dayVal),
      startTime: conf.startTime,
      endTime: conf.endTime,
      timezone,
    }));

    setSaving(true);
    try {
      await api.setAvailability(payload);
      addToast("Availability saved successfully");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", animation: "fadeIn 0.4s ease-out" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.02em" }}>Availability</h1>
      <p style={{ color: "var(--color-text-tertiary)", marginBottom: "32px", fontSize: "15px" }}>
        Configure when you're available for meetings. Guests will only see available slots.
      </p>

      <div style={{ background: "var(--color-bg-primary)", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
        
        <div style={{ marginBottom: "32px", display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Event Type</label>
            <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg-subtle)", fontSize: "14px", outline: "none" }}>
              <option value="">Select an event type...</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Timezone</label>
            <input type="text" readOnly value={timezone} disabled
              style={{ width: "100%", padding: "12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg-subtle)", fontSize: "14px", opacity: 0.6 }} />
          </div>
        </div>

        {selectedEventId && !loadingAvail && (
          <div style={{ animation: "slideUp 0.3s ease-out" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "16px" }}>Weekly Schedule</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--color-border-subtle)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              {DAYS.map(day => {
                const isEnabled = schedule[day.value] !== null;
                const conf = schedule[day.value] || DEFAULT_TIME;
                
                return (
                  <div key={day.value} style={{ display: "flex", alignItems: "center", padding: "16px 20px", background: "var(--color-bg-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "140px" }}>
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleDay(day.value)} style={{ width: "18px", height: "18px", marginRight: "12px", cursor: "pointer", accentColor: "black" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: isEnabled ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>{day.label}</span>
                    </div>

                    {isEnabled ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <input type="time" value={conf.startTime} onChange={e => setSchedule({ ...schedule, [day.value]: { ...conf, startTime: e.target.value }})}
                          style={{ padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "14px", outline: "none" }} />
                        <span style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>–</span>
                        <input type="time" value={conf.endTime} onChange={e => setSchedule({ ...schedule, [day.value]: { ...conf, endTime: e.target.value }})}
                          style={{ padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "14px", outline: "none" }} />
                        <button onClick={() => applyToAll(day.value)} title="Copy to all enabled days" style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", transition: "var(--transition-fast)" }} 
                         onMouseEnter={e => e.target.style.color = "var(--color-text-primary)"}
                         onMouseLeave={e => e.target.style.color = "var(--color-text-tertiary)"}>
                          Apply to all
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: "14px", color: "var(--color-text-tertiary)", fontStyle: "italic" }}>Unavailable</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedEventId && (
        <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "12px 28px", background: "var(--color-brand)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "var(--transition-fast)"
          }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}