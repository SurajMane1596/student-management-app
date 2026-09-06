import { AppError } from "./errorHandler.js";

// Usage: router.post("/x", validate(schema), handler)
// Validates req.body by default; pass { source: "query" } for query params.
// On success, replaces req.body/req.query with the parsed (and
// coerced/defaulted) value so handlers always see clean data.
export function validate(schema, { source = "body" } = {}) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError("Validation failed", 422, details));
    }
    req[source] = result.data;
    next();
  };
}
