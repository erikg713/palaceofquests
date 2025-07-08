import ErrorLog from './models/ErrorLog.js'; // adjust path if needed

export const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err.stack);

  // Save error to DB
  try {
    await ErrorLog.create({
      message: err.message,
      stack: err.stack,
      statusCode,
      url: req.originalUrl,
      method: req.method,
    });
  } catch (logErr) {
    console.error('Failed to log error to DB:', logErr);
  }

  // Send response
  res.status(statusCode).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
