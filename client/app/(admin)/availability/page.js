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
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Availability</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
        Configure when you're available for meetings. Guests will only see available slots.
      </p>

      <div style={{ background: "var(--color-bg-primary)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
        
        <div style={{ marginBottom: "24px", display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>Event Type</label>
            <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)" }}>
              <option value="">Select an event type to edit...</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>Timezone</label>
            <input type="text" readOnly value={timezone} disabled
              style={{ width: "100%", padding: "10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)", opacity: 0.7 }} />
          </div>
        </div>

        {selectedEventId && !loadingAvail && (
          <div>
            <label style={{ fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "16px" }}>Weekly Schedule</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {DAYS.map(day => {
                const isEnabled = schedule[day.value] !== null;
                const conf = schedule[day.value] || DEFAULT_TIME;
                
                return (
                  <div key={day.value} style={{ display: "flex", alignItems: "center", padding: "12px 16px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: isEnabled ? "var(--color-bg-primary)" : "var(--color-bg-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "120px" }}>
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleDay(day.value)} style={{ width: "16px", height: "16px", marginRight: "12px", cursor: "pointer" }} />
                      <span style={{ fontSize: "14px", fontWeight: 500, opacity: isEnabled ? 1 : 0.5 }}>{day.label}</span>
                    </div>

                    {isEnabled ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <input type="time" value={conf.startTime} onChange={e => setSchedule({ ...schedule, [day.value]: { ...conf, startTime: e.target.value }})}
                          style={{ padding: "6px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }} />
                        <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>–</span>
                        <input type="time" value={conf.endTime} onChange={e => setSchedule({ ...schedule, [day.value]: { ...conf, endTime: e.target.value }})}
                          style={{ padding: "6px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }} />
                        <button onClick={() => applyToAll(day.value)} title="Copy to all enabled days" style={{ marginLeft: "auto", fontSize: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                          📋 Apply to all
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: "14px", color: "var(--color-text-tertiary)" }}>Unavailable</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedEventId && (
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "10px 24px", background: "var(--color-brand)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer"
          }}>
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      )}
    </div>
  );
}