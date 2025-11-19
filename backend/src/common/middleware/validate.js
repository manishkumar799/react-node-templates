export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      { params: req.params, query: req.query, body: req.body },
      { abortEarly: false, stripUnknown: true }
    );
    if (error) {
      const err = new Error("Validation failed");
      err.code = "VALIDATION_ERROR";
      err.httpStatus = 400;
      err.details = error.details.map((d) => d.message);
      next(err);
    } else {
      req.params = value.params || req.params;
      req.query = value.query || req.query;
      req.body = value.body || req.body;
      next();
    }
  };
}
