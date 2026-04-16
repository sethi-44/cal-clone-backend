"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

export default function DashboardPage() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [tab, setTab] = useState("upcoming"); // upcoming, past, cancelled
  const [eventFilter, setEventFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bookingsData, eventsData] = await Promise.all([
        api.getAllBookings(),
        api.getEvents()
      ]);
      setBookings(bookingsData || []);
      setEvents(eventsData || []);
    } catch (err) {
      addToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.cancelBooking(id);
      addToast("Booking cancelled");
      fetchAll();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const now = useMemo(() => new Date(), [tick]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Status tab filter
    switch (tab) {
      case "upcoming":
        result = result.filter(b => b.status === "CONFIRMED" && new Date(b.startTime) >= now);
        break;
      case "past":
        result = result.filter(b => b.status === "CONFIRMED" && new Date(b.startTime) < now);
        break;
      case "cancelled":
        result = result.filter(b => b.status === "CANCELLED");
        break;
    }

    // Event filter
    if (eventFilter !== "all") {
      result = result.filter(b => b.eventTypeId === eventFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.email.toLowerCase().includes(q)
      );
    }

    return result;
  }, [bookings, tab, eventFilter, searchQuery, now]);

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Bookings</h1>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: "24px" }}>
        {["upcoming", "past", "cancelled"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", background: "none", border: "none", 
            borderBottom: tab === t ? "2px solid var(--color-brand)" : "2px solid transparent",
            color: tab === t ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: tab === t ? 600 : 400, fontSize: "14px", cursor: "pointer",
            textTransform: "capitalize"
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input type="text" placeholder="Search name or email..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "14px" }}
        />
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "14px", background: "var(--color-bg-primary)" }}
        >
          <option value="all">All Events</option>
          {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1,2,3].map(i => <Skeleton key={i} height="80px" borderRadius="var(--radius-md)" />)}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState 
          icon={tab === "upcoming" ? "📅" : tab === "past" ? "📁" : "🚫"} 
          title={`No ${tab} bookings`} 
          description={searchQuery ? "Try adjusting your search" : "No bookings found matching the current criteria."}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredBookings.map((booking) => {
            const start = new Date(booking.startTime);
            return (
              <div key={booking.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px", background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)"
              }}>
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  <div style={{ 
                    textAlign: "center", background: "var(--color-bg-secondary)", 
                    padding: "10px", borderRadius: "var(--radius-sm)", minWidth: "70px" 
                  }}>
                    <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                      {start.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>
                      {start.getDate()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h4 style={{ fontSize: "16px", fontWeight: 600 }}>{booking.name}</h4>
                      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>•</span>
                      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{booking.email}</span>
                    </div>
                    
                    <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", background: "var(--color-bg-tertiary)", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", color: "var(--color-text-primary)"}}>
                        {booking.eventType?.title || "Unknown Event"}
                      </span>
                      <span>
                        {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        {' – '}
                        {new Date(booking.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {tab === "upcoming" && (
                  <button onClick={() => handleCancel(booking.id)} style={{
                    padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)",
                    background: "transparent", color: "var(--color-error)", fontSize: "13px", cursor: "pointer",
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}