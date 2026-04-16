function generateSlots(startTime, endTime, duration) {
  const slots = [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0);

  while (current < end) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + duration * 60000);

    if (slotEnd <= end) {
      slots.push({
        start: slotStart.toTimeString().slice(0, 5),
        end: slotEnd.toTimeString().slice(0, 5),
      });
    }

    current = new Date(current.getTime() + duration * 60000);
  }

  return slots;
}

module.exports = { generateSlots };