class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Prisma-specific errors
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Resource already exists" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.status(500).json({ error: "Internal server error" });
};

module.exports = { AppError, errorHandler };
