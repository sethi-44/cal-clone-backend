const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }
    next(err);
  }
};

module.exports = validate;
