"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this event?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  const handleEdit = async (event) => {
    const newTitle = prompt("Enter new title", event.title);
    if (!newTitle) return;

    await fetch(`http://localhost:5000/api/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });

    fetchEvents();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Events</h1>

        <Link href="/create-event">
          <button className="bg-black text-white px-4 py-2 rounded">
            + Create Event
          </button>
        </Link>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <p className="text-gray-500">No events yet</p>
      )}

      {/* Events list */}
      {events.map((event) => (
        <div
          key={event.id}
          className="border p-4 rounded mb-3 hover:shadow"
        >
          <h2 className="text-lg font-semibold">
            {event.title}
          </h2>

          <p className="text-gray-600">
            {event.description}
          </p>

          <p className="text-sm mt-1">
            {event.duration} mins
          </p>

          <Link
            href={`/book/${event.slug}`}
            className="text-blue-600 text-sm mt-2 inline-block"
          >
            View Booking Page →
          </Link>

          {/* 🔥 NEW: Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleEdit(event)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}