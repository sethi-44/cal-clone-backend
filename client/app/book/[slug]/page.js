"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch event by slug
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.slug === slug);
        setEvent(found);
      });
  }, [slug]);

  // Fetch slots
  useEffect(() => {
    if (!date || !event) return;

    fetch(`http://localhost:5000/api/slots/${event.id}?date=${date}`)
      .then(res => res.json())
      .then(data => setSlots(data));
  }, [date, event]);

  if (!event) return <p className="p-6">Loading...</p>;

  if (success) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">
          🎉 Booking Confirmed!
        </h1>
        <p className="mb-4">
          Your meeting at {selectedSlot?.start} has been scheduled.
        </p>

        <button
          className="bg-black text-white px-4 py-2"
          onClick={() => {
            setSuccess(false);
            setSelectedSlot(null);
          }}
        >
          Book Another
        </button>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">{event.title}</h1>

      {/* Date Picker */}
      <input
        type="date"
        className="border p-2 mb-4"
        onChange={(e) => {
          setDate(e.target.value);
          setSelectedSlot(null);
        }}
      />

      {/* No slots message */}
      {slots.length === 0 && date && (
        <p className="text-gray-500 mb-4">
          No availability for selected date
        </p>
      )}

      {/* Slots */}
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={() => setSelectedSlot(slot)}
            className={`border p-2 ${
              selectedSlot?.start === slot.start
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            {slot.start}
          </button>
        ))}
      </div>

      {/* Booking Form */}
      {selectedSlot && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">
            Book at {selectedSlot.start}
          </h2>

          <input
            placeholder="Your name"
            className="border p-2 w-full mb-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Your email"
            className="border p-2 w-full mb-2"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2"
            onClick={async () => {
              try {
                setLoading(true);

                const start = new Date(
                  `${date}T${selectedSlot.start}:00`
                );

                const end = new Date(
                  start.getTime() + event.duration * 60000
                );

                const res = await fetch(
                  "http://localhost:5000/api/bookings",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      eventTypeId: event.id,
                      name: form.name,
                      email: form.email,
                      startTime: start.toISOString(),
                      endTime: end.toISOString(),
                    }),
                  }
                );

                const data = await res.json();

                // ✅ Handle backend errors properly
                if (!res.ok) {
                  alert(data.message || "Booking failed");
                  return;
                }

                // ✅ Success only if backend confirms
                setSuccess(true);
                // Refresh slots
                const slotRes = await fetch(
                  `http://localhost:5000/api/slots/${event.id}?date=${date}`
                );
                const updated = await slotRes.json();
                setSlots(updated);

                setSelectedSlot(null);
                setForm({ name: "", email: "" });

              } catch (err) {
                alert("Something went wrong");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}