export const validateRequest = (schema, source = "body") => (req, res, next) => {
  const parsed = schema.safeParse(req[source]);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    return next(Object.assign(new Error(message || "Validation failed"), { status: 400 }));
  }

  req[source] = parsed.data;
  return next();
};
