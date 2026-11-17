const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      errorType: 'MongoValidationError',
      message: messages.join('; '),
      details: messages
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      errorType: 'MongoDuplicateKeyError',
      message: `Duplicate value entered for ${field}. Record already exists.`
    });
  }

  // Mongoose Bad ObjectId CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      errorType: 'MongoCastError',
      message: `Invalid MongoDB ObjectId format for ${err.path}: ${err.value}`
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    errorType: 'ServerError',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
