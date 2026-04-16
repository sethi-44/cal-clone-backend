"use client";

import { useState, useMemo } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ selectedDate, onSelectDate, availableDays = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startPad = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Padding for days before month start
    for (let i = 0; i < startPad; i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();
      const isPast = date < today;
      // If availableDays array is empty, assume all future days are available (fallback)
      // Otherwise only allow days in the availableDays array
      const isAvailable = !isPast && (availableDays.length === 0 || availableDays.includes(dayOfWeek));
      const isSelected = selectedDate === dateStr;
      const isToday = date.getTime() === today.getTime();

      days.push({ day: d, date, dateStr, isPast, isAvailable, isSelected, isToday });
    }

    return days;
  }, [viewMonth, viewYear, selectedDate, availableDays, today]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const canGoPrev = viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div style={{
      background: "var(--color-bg-primary)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--color-border)",
      padding: "20px",
      width: "100%",
      maxWidth: "350px",
    }}>
      {/* Month Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: canGoPrev ? "pointer" : "not-allowed",
            opacity: canGoPrev ? 1 : 0.3,
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-text-primary)",
          }}
        >
          ‹
        </button>
        <span style={{ fontWeight: 600, fontSize: "15px" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-text-primary)",
          }}
        >
          ›
        </button>
      </div>

      {/* Day Headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "2px",
        marginBottom: "8px",
      }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-text-tertiary)",
            padding: "4px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "2px",
      }}>
        {calendarDays.map((day, i) => {
          if (!day) {
            return <div key={`pad-${i}`} />;
          }

          return (
            <button
              key={day.dateStr}
              disabled={!day.isAvailable}
              type="button"
              onClick={() => onSelectDate(day.dateStr)}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: day.isToday ? "1px solid var(--color-border)" : "none",
                fontSize: "14px",
                fontWeight: day.isSelected ? 600 : day.isToday ? 500 : 400,
                cursor: day.isAvailable ? "pointer" : "default",
                transition: "var(--transition-fast)",
                background: day.isSelected
                  ? "var(--color-brand)"
                  : "transparent",
                color: day.isSelected
                  ? "var(--color-text-inverse)"
                  : day.isAvailable
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                opacity: day.isPast ? 0.3 : 1,
                margin: "0 auto",
              }}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
