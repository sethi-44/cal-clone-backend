"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Calendar from "@/components/booking/Calendar";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

function fetchTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export default function BookingPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [hostTimezone, setHostTimezone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Computed state
  const isFormValid = form.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const availableDays = [1, 2, 3, 4, 5]; // Note: in real app, fetch from event's generic availability

  const fetchSlotsRef = useRef(null);

  useEffect(() => {
    api.getEventBySlug(slug)
      .then(setEvent)
      .catch(() => setError("Event not found or link is invalid."))
      .finally(() => setInitialLoading(false));
  }, [slug]);

  const fetchSlots = async () => {
    if (!event || !date) return;
    setSlotsLoading(true);
    try {
      const data = await api.getSlots(event.id, date);
      setSlots(data.slots || []);
      setHostTimezone(data.hostTimezone || "UTC");
      setSelectedSlot(null);
    } catch (err) {
      setError("Failed to load available times.");
    } finally {
      setSlotsLoading(false);
    }
  };

  fetchSlotsRef.current = fetchSlots;

  useEffect(() => {
    if (date) fetchSlotsRef.current();
  }, [date]);

  const handleBooking = async () => {
    if (submitting || !selectedSlot || !isFormValid) return; // EC-4 Fix

    setSubmitting(true);
    setError(null);

    // EC-14 Stale snapshot protection
    const snapshotSlots = [...slots];
    setSlots(slots.map(s => s.start === selectedSlot.start ? { ...s, available: false } : s));

    try {
      // Use exact UTC time from server to guarantee timezone matching
      const startTimeUTC = new Date(selectedSlot.utcStart);
      const endTimeUTC = new Date(selectedSlot.utcEnd);

      const booking = await api.createBooking({
        eventTypeId: event.id,
        name: form.name.trim(),
        email: form.email.trim(),
        startTime: startTimeUTC.toISOString(),
        endTime: endTimeUTC.toISOString(),
      });

      setBookingSuccess(booking);
      window.history.replaceState(null, "", window.location.href); // EC-17 Fix
    } catch (err) {
      // Restore snapshot
      setSlots(snapshotSlots);
      
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Network error. Please try again.");
      } else {
        setError(err.message || "Failed to book slot");
        // Always refresh on error just in case
        fetchSlotsRef.current();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", opacity: 0.5 }}>Loading...</div>;
  }

  if (error && !event) {
    return <div style={{ textAlign: "center", marginTop: "80px" }}><h1>Opps!</h1><p>{error}</p></div>;
  }

  if (bookingSuccess) {
    return <BookingConfirmation booking={bookingSuccess} event={event} onBookAnother={() => { setBookingSuccess(null); setSelectedSlot(null); setDate(""); setForm({name:"", email:""}); }} />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", animation: "scaleIn 0.3s ease-out" }}>
      <div style={{ display: "flex", flexDirection: "column", md: { flexDirection: "row" }, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
        
        {/* Left Side: Event Info */}
        <div style={{ padding: "40px", borderRight: "1px solid var(--cal-border-subtle)", minWidth: "320px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
             <div style={{ 
               width: "24px", height: "24px", background: "var(--cal-brand)", 
               borderRadius: "5px", display: "flex", alignItems: "center", 
               justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 800 
             }}>C</div>
             <span style={{ fontWeight: 600, fontSize: "14px", letterSpacing: "-0.01em", color: "var(--cal-text-muted)" }}>CalClone</span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 16px", color: "var(--cal-text-emphasis)", letterSpacing: "-0.03em" }}>
            {event.title}
          </h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--cal-text-subtle)", fontSize: "14px", marginBottom: "24px", fontWeight: 500 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>⏱️ {event.duration} min</span>
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--cal-text-subtle)" }}>
            {event.description}
          </p>
        </div>

        {/* Right Side: Booking Flow */}
        <div style={{ padding: "40px", flex: 1, background: "var(--cal-bg)" }}>
          {error && (
            <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "14px", marginBottom: "24px" }}>
              {error}
            </div>
          )}

          {!selectedSlot ? (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px", color: "var(--cal-text-emphasis)" }}>Select a Date & Time</h2>
              
              <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <Calendar 
                  selectedDate={date} 
                  onSelectDate={(d) => { setDate(d); setError(null); }} 
                  availableDays={availableDays} 
                />

                <div style={{ flex: 1, minWidth: "240px" }}>
                  {date ? (
                    slotsLoading ? (
                      <div style={{ color: "var(--cal-text-muted)", fontSize: "14px", padding: "20px" }}>Loading times...</div>
                    ) : slots.length === 0 ? (
                      <div style={{ color: "var(--cal-text-muted)", fontSize: "14px", padding: "20px" }}>No times available on this date.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "420px", overflowY: "auto", paddingRight: "8px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--cal-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                          Available Times
                        </p>
                        {slots.map((s) => (
                          <button
                            key={s.utcStart}
                            disabled={!s.available}
                            onClick={() => setSelectedSlot(s)}
                            className={s.available ? "cal-card" : ""}
                            style={{
                              padding: "12px 16px", 
                              border: !s.available ? "1px solid var(--cal-border-subtle)" : "1px solid var(--cal-border)",
                              borderRadius: "var(--radius-md)", 
                              fontSize: "14px", 
                              fontWeight: 600,
                              background: !s.available ? "var(--cal-bg-muted)" : "var(--cal-bg)",
                              color: !s.available ? "var(--cal-text-muted)" : "var(--cal-text-emphasis)",
                              cursor: !s.available ? "not-allowed" : "pointer", 
                              textDecoration: !s.available ? "line-through" : "none",
                              textAlign: "center"
                            }}
                          >
                            {new Date(s.utcStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <div style={{ color: "var(--cal-text-muted)", fontSize: "14px", padding: "20px", textAlign: "center", border: "2px dashed var(--cal-border-subtle)", borderRadius: "var(--radius-lg)" }}>
                      Select a date to see available times.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ animation: "slideUp 0.3s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <button onClick={() => setSelectedSlot(null)} style={{ background: "none", border: "1px solid var(--cal-border)", borderRadius: "var(--radius-md)", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                  ← Back
                </button>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--cal-text-emphasis)" }}>
                  {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {new Date(selectedSlot.utcStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "480px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", display: "block", color: "var(--cal-text)" }}>Name</label>
                  <input type="text" required placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--cal-border)", borderRadius: "var(--radius-md)", fontSize: "14px", background: "var(--cal-bg-muted)", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", display: "block", color: "var(--cal-text)" }}>Email</label>
                  <input type="email" required placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--cal-border)", borderRadius: "var(--radius-md)", fontSize: "14px", background: "var(--cal-bg-muted)", outline: "none" }} />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <button 
                    onClick={handleBooking} 
                    disabled={submitting || !isFormValid}
                    className="cal-button-primary"
                    style={{
                      width: "100%", padding: "16px", 
                      fontSize: "15px", border: "none", borderRadius: "var(--radius-md)",
                      cursor: (submitting || !isFormValid) ? "not-allowed" : "pointer", opacity: (submitting || !isFormValid) ? 0.6 : 1
                    }}
                  >
                    {submitting ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
