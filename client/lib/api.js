const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(url, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  // Don't stringify body if it's already a string
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(`${BASE_URL}${url}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

export const api = {
  // Events
  getEvents: () => request("/api/events"),
  getEventBySlug: (slug) => request(`/api/events/slug/${slug}`),
  getEventById: (id) => request(`/api/events/${id}`),
  createEvent: (data) =>
    request("/api/events", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id, data) =>
    request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),

  // Availability
  getAvailability: (eventTypeId) =>
    request(`/api/availability/${eventTypeId}`),
  setAvailability: (data) =>
    request("/api/availability", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Slots
  getSlots: (eventTypeId, date) =>
    request(`/api/slots/${eventTypeId}?date=${date}`),

  // Bookings
  getAllBookings: () => request("/api/bookings"),
  getBookings: (eventTypeId) => request(`/api/bookings/${eventTypeId}`),
  createBooking: (data) =>
    request("/api/bookings", { method: "POST", body: JSON.stringify(data) }),
  cancelBooking: (id) => request(`/api/bookings/${id}`, { method: "DELETE" }),
};