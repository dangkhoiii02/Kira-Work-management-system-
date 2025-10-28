module.exports = (schema) => (req, res, next) => {
  try {
    const parsed = {
      params: schema.shape?.params ? schema.shape.params.parse(req.params) : req.params,
      query:  schema.shape?.query  ? schema.shape.query.parse(req.query)   : req.query,
      body:   schema.shape?.body   ? schema.shape.body.parse(req.body)     : req.body,
    };
    req.valid = parsed;
    next();
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: 'Validation error',
      details: e.errors || e.message
    });
  }
};
