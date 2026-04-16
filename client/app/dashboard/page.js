"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  const eventTypeId = "28149d82-a9f4-49c7-aa74-97861579376f";

  const fetchBookings = async () => {
    const res = await fetch(
      `http://localhost:5000/api/bookings/${eventTypeId}`
    );
    const data = await res.json();
    console.log("BOOKINGS RESPONSE:", data);
    console.log("TYPE:", typeof data);
    console.log("IS ARRAY:", Array.isArray(data));
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "DELETE",
    });

    fetchBookings();
  };

  const now = new Date();

 const safeBookings = Array.isArray(bookings) ? bookings : [];

const upcoming = safeBookings.filter(
  (b) => new Date(b.startTime) >= now
);

const past = safeBookings.filter(
  (b) => new Date(b.startTime) < now
);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Upcoming */}
      <h2 className="text-xl font-semibold mt-4 mb-2">
        Upcoming Bookings
      </h2>

      {upcoming.length === 0 && <p>No upcoming bookings</p>}

      {upcoming.map((b) => (
        <div
          key={b.id}
          className="border p-3 mb-2 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{b.name}</p>
            <p className="text-sm text-gray-600">{b.email}</p>
            <p className="text-sm">
              {new Date(b.startTime).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => cancelBooking(b.id)}
            className="bg-red-500 text-white px-3 py-1"
          >
            Cancel
          </button>
        </div>
      ))}

      {/* Past */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        Past Bookings
      </h2>

      {past.length === 0 && <p>No past bookings</p>}

      {past.map((b) => (
        <div key={b.id} className="border p-3 mb-2">
          <p className="font-medium">{b.name}</p>
          <p className="text-sm text-gray-600">{b.email}</p>
          <p className="text-sm">
            {new Date(b.startTime).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}