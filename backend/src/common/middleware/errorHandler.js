export default function errorHandler() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const status = err.httpStatus || 500;
    const code = err.code || "INTERNAL_ERROR";
    const message = err.message || "Internal server error";
    const details = err.details || undefined;

    res.status(status).json({
      error: { code, message, details },
    });
  };
}
