const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");

const eventRoutes = require("./routes/event.routes");
const availabilityRoutes = require("./routes/availability.routes");
const slotRoutes = require("./routes/slot.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CalClone API is running", version: "1.0.0" });
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});