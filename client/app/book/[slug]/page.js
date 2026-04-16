"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [prevSlots, setPrevSlots] = useState([]);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch event
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

    const fetchSlots = async () => {
      const res = await fetch(
        `http://localhost:5000/api/slots/${event.id}?date=${date}`
      );
      const data = await res.json();
      setSlots(data);
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);

    return () => clearInterval(interval);
  }, [date, event]);

  if (!event) return <p className="p-6">Loading...</p>;
  // console.log("SLOTS:", slots);

  // ✅ Success Screen
  if (success) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">
          🎉 Booking Confirmed!
        </h1>
        <p className="mb-4">
          Your meeting at {selectedSlot} has been scheduled.
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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{event.title}</h1>

      {/* Date Picker */}
      <input
        type="date"
        className="border p-2 mb-4 w-full"
        onChange={(e) => {
          setDate(e.target.value);
          setSelectedSlot(null);
        }}
      />

      {/* No slots */}
      {slots.length === 0 && date && (
        <p className="text-gray-500 mb-4">
          No availability for selected date
        </p>
      )}
      
      {/* Slots */}
      <div className="grid grid-cols-3 gap-2">
        {slots.filter(slot => slot.available).map((slot, i) => (
          <button
            key={i}
            disabled={!slot.available}
            onClick={() => {
              if (!slot.available) return;
              setSelectedSlot(slot.start);
              setError(""); // reset error
            }}
            className={`border p-2 rounded transition-all duration-200 ${
              !slot.available
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : selectedSlot === slot.start
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
            Book at {selectedSlot}
          </h2>

          {error && (
            <p className="text-red-500 mb-2">{error}</p>
          )}

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
            className="bg-black text-white px-4 py-2 w-full"
            onClick={async () => {
              try {
                setLoading(true);
                setError("");

                const start = new Date(`${date}T${selectedSlot}:00`);
                const end = new Date(
                  start.getTime() + event.duration * 60000
                );

                // 🧠 Save previous slots
                setPrevSlots(slots);

                // ⚡ Optimistic UI
                setSlots(prev =>
                  prev.map(s =>
                    s.start === selectedSlot
                      ? { ...s, available: false }
                      : s
                  )
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

                if (!res.ok) {
                  // ❌ rollback
                  setSlots(prevSlots);
                  setError(data.message || "Booking failed");
                  return;
                }

                // ✅ success
                setSuccess(true);
                setSelectedSlot(null);
                setForm({ name: "", email: "" });

              } catch (err) {
                setSlots(prevSlots); // rollback
                setError("Something went wrong");
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