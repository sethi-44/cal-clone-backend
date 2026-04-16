"use client";

import { useState } from "react";

const days = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export default function AvailabilityPage() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);

  const eventTypeId = "28149d82-a9f4-49c7-aa74-97861579376f"; // ⚠️ replace

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
        prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
    };

  const handleSave = async () => {
    console.log("Selected Days:", selectedDays); 
    if (selectedDays.length === 0) {
      alert("Select at least one day");
      return;
    }

    try {
      setLoading(true);

      const payload = selectedDays.map((day) => ({
        eventTypeId,
        dayOfWeek: day,
        startTime,
        endTime,
        timezone: "Asia/Kolkata",
      }));
      console.log("Payload:", payload);

      const res = await fetch("http://localhost:5000/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save availability");
      }

      alert("Availability saved!");
      setSelectedDays([]);
    } catch (err) {
      alert("Error saving availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Set Availability</h1>

      {/* Days */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Select Days</p>
        <div className="grid grid-cols-3 gap-2">
          {days.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={`px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${
                selectedDays.includes(day.value)
                    ? "bg-black text-white border-black scale-105"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Time Range</p>
        <div className="flex gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Saving..." : "Save Availability"}
      </button>
    </div>
  );
}