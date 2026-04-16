"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Calendar from "@/components/booking/Calendar";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

function fetchTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export default function ReschedulePage() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
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

  const availableDays = [1, 2, 3, 4, 5]; 

  const fetchSlotsRef = useRef(null);

  useEffect(() => {
    api.getBookingById(id)
      .then((data) => {
        setBooking(data);
        setEvent(data.eventType);
        setForm({ name: data.name, email: data.email });
      })
      .catch((err) => setError("Booking not found or link is invalid."))
      .finally(() => setInitialLoading(false));
  }, [id]);

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
    if (submitting || !selectedSlot) return;

    setSubmitting(true);
    setError(null);

    const snapshotSlots = [...slots];
    setSlots(slots.map(s => s.start === selectedSlot.start ? { ...s, available: false } : s));

    try {
      const startTimeUTC = new Date(selectedSlot.utcStart);
      const endTimeUTC = new Date(selectedSlot.utcEnd);

      const updatedBooking = await api.rescheduleBooking(id, {
        startTime: startTimeUTC.toISOString(),
        endTime: endTimeUTC.toISOString(),
      });

      setBookingSuccess(updatedBooking);
      window.history.replaceState(null, "", window.location.href);
    } catch (err) {
      setSlots(snapshotSlots);
      
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Network error. Please try again.");
      } else {
        setError(err.message || "Failed to reschedule");
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
    return <BookingConfirmation booking={bookingSuccess} event={event} onBookAnother={() => window.location.href = '/dashboard'} isReschedule={true} />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", animation: "scaleIn 0.3s ease-out" }}>
      <div style={{ display: "flex", flexDirection: "column", md: { flexDirection: "row" }, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
        
        {/* Left Side: Event Info */}
        <div style={{ padding: "32px", borderRight: "1px solid var(--color-border)", minWidth: "300px", flexShrink: 0 }}>
          <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: "8px" }}>
            ⚡ CalClone
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 12px", color: "var(--color-text-primary)" }}>
            {event.title}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--color-text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            <span>⏱️ {event.duration} min</span>
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.5", color: "var(--color-text-secondary)" }}>
            {event.description}
          </p>
        </div>

        {/* Right Side: Booking Flow */}
        <div style={{ padding: "32px", flex: 1, background: "var(--color-bg-secondary)" }}>
          {error && (
            <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", fontSize: "14px", marginBottom: "24px" }}>
              {error}
            </div>
          )}

          {!selectedSlot ? (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>Select a Date & Time</h2>
              
              <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <Calendar 
                  selectedDate={date} 
                  onSelectDate={(d) => { setDate(d); setError(null); }} 
                  availableDays={availableDays} 
                />

                <div style={{ flex: 1, minWidth: "200px" }}>
                  {date ? (
                    slotsLoading ? (
                      <div style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>Loading times...</div>
                    ) : slots.length === 0 ? (
                      <div style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>No times available on this date.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto", paddingRight: "8px" }}>
                        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 8px" }}>
                          Times in your timezone ({fetchTz()})
                        </p>
                        {slots.map((s) => (
                          <button
                            key={s.utcStart}
                            disabled={!s.available}
                            onClick={() => setSelectedSlot(s)}
                            style={{
                              padding: "14px 16px", border: `1px solid ${!s.available ? "var(--color-border)" : "var(--color-brand)"}`,
                              borderRadius: "var(--radius-sm)", fontSize: "15px", fontWeight: 500,
                              background: !s.available ? "var(--color-bg-tertiary)" : "var(--color-bg-primary)",
                              color: !s.available ? "var(--color-text-tertiary)" : "var(--color-brand)",
                              cursor: !s.available ? "not-allowed" : "pointer", textDecoration: !s.available ? "line-through" : "none",
                              transition: "var(--transition-fast)"
                            }}
                          >
                            {new Date(s.utcStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <div style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>
                      Select a date to see available times.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ animation: "slideInRight 0.2s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button onClick={() => setSelectedSlot(null)} style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>
                  ← Back
                </button>
                <div style={{ fontSize: "15px", fontWeight: 500 }}>
                  Selected: {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} at {new Date(selectedSlot.utcStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ padding: "16px", background: "var(--color-bg-primary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                  <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "4px" }}>Rescheduling for</div>
                  <div style={{ fontWeight: 600 }}>{form.name}</div>
                  <div style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{form.email}</div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <button 
                    onClick={handleBooking} 
                    disabled={submitting}
                    style={{
                      width: "100%", padding: "16px", background: "var(--color-brand)", color: "white", 
                      fontSize: "16px", fontWeight: 600, border: "none", borderRadius: "var(--radius-md)",
                      cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, transition: "var(--transition-fast)"
                    }}
                  >
                    {submitting ? "Rescheduling..." : "Confirm Reschedule"}
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
