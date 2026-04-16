/**
 * Generate time slots between startTime and endTime with given duration.
 * Pure function — no Date objects, no side effects, no locale dependency.
 *
 * @param {string} startTime - "HH:MM" format (e.g., "09:00")
 * @param {string} endTime   - "HH:MM" format (e.g., "17:00")
 * @param {number} duration  - slot duration in minutes
 * @param {number} buffer    - buffer time between slots in minutes (default 0)
 * @returns {Array<{start: string, end: string}>}
 */
function generateSlots(startTime, endTime, duration, buffer = 0) {
  if (duration <= 0) return [];
  if (buffer < 0) buffer = 0;

  const slots = [];

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  // Handle overnight availability (e.g., 22:00 - 02:00)
  const adjustedEnd =
    endMinutes <= currentMinutes ? endMinutes + 1440 : endMinutes;

  while (currentMinutes + duration <= adjustedEnd) {
    const slotStartH = Math.floor(currentMinutes / 60) % 24;
    const slotStartM = currentMinutes % 60;

    const slotEndMinutes = currentMinutes + duration;
    const slotEndH = Math.floor(slotEndMinutes / 60) % 24;
    const slotEndM = slotEndMinutes % 60;

    slots.push({
      start: `${String(slotStartH).padStart(2, "0")}:${String(slotStartM).padStart(2, "0")}`,
      end: `${String(slotEndH).padStart(2, "0")}:${String(slotEndM).padStart(2, "0")}`,
    });

    currentMinutes += duration + buffer;
  }

  return slots;
}

module.exports = { generateSlots };