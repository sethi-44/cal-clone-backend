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
      padding: "8px",
      width: "100%",
      maxWidth: "350px",
    }}>
      {/* Month Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        padding: "0 8px"
      }}>
        <span style={{ fontWeight: 600, fontSize: "16px", color: "var(--color-text-primary)" }}>
          {MONTH_NAMES[viewMonth]} <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>{viewYear}</span>
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            type="button"
            style={{
              background: "none",
              border: "1px solid var(--color-border-subtle)",
              fontSize: "14px",
              cursor: canGoPrev ? "pointer" : "not-allowed",
              opacity: canGoPrev ? 1 : 0.4,
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
              transition: "var(--transition-fast)",
            }}
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            type="button"
            style={{
              background: "none",
              border: "1px solid var(--color-border-subtle)",
              fontSize: "14px",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
              transition: "var(--transition-fast)",
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginBottom: "12px",
      }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
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
                aspectRatio: "1/1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-md)",
                border: "none",
                fontSize: "14px",
                fontWeight: day.isSelected ? 600 : 500,
                cursor: day.isAvailable ? "pointer" : "default",
                transition: "var(--transition-fast)",
                background: day.isSelected
                  ? "var(--color-brand)"
                  : day.isToday
                    ? "var(--color-bg-secondary)"
                    : "transparent",
                color: day.isSelected
                  ? "var(--color-text-inverse)"
                  : day.isAvailable
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                position: "relative"
              }}
              onMouseEnter={e => {
                if(day.isAvailable && !day.isSelected) e.target.style.background = "var(--color-bg-hover)";
              }}
              onMouseLeave={e => {
                if(day.isAvailable && !day.isSelected) e.target.style.background = day.isToday ? "var(--color-bg-secondary)" : "transparent";
              }}
            >
              {day.day}
              {day.isToday && !day.isSelected && (
                <div style={{ position: "absolute", bottom: "6px", width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-brand)" }} />
              )}
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
