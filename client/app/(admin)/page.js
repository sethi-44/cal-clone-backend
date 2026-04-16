"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import EventCard from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";

export default function EventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      await api.deleteEvent(eventToDelete.id);
      addToast("Event type deleted");
      setEvents(events.filter((e) => e.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Event Types</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Create and manage your default event types
          </p>
        </div>
        <Link href="/create-event" style={{
          padding: "10px 16px",
          background: "var(--color-brand)",
          color: "white",
          borderRadius: "var(--radius-md)",
          fontSize: "14px",
          fontWeight: 500,
          transition: "var(--transition-fast)",
        }}>
          + New Event Type
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {loading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : events.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <EmptyState 
              title="No event types yet" 
              description="Create your first event type to start accepting bookings."
            />
          </div>
        ) : (
          events.map((ev, i) => (
            <EventCard 
              key={ev.id} 
              event={ev} 
              colorIndex={i}
              onDelete={setEventToDelete}
            />
          ))
        )}
      </div>

      <Modal
        open={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        title="Delete Event Type"
        actions={<>
          <button onClick={() => setEventToDelete(null)} style={{ padding: "8px 16px", border: "1px solid var(--color-border)", background: "transparent", borderRadius: "10px", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ padding: "8px 16px", border: "none", background: "var(--color-error)", color: "white", borderRadius: "10px", cursor: "pointer" }}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </>}
      >
        <p style={{ fontSize: "14px" }}>
          Are you sure you want to delete <strong>{eventToDelete?.title}</strong>? 
          This will also delete any associated availability. 
          Existing bookings will not be affected unless you cancel them.
        </p>
      </Modal>
    </div>
  );
}