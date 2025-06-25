// Load environment variables early
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Joi = require('joi');
const winston = require('winston');
const PiNetwork = require('pi-backend');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Environment validation using Joi for clarity and strictness
const envSchema = Joi.object({
  PI_API_KEY: Joi.string().required(),
  PI_WALLET_SECRET: Joi.string().required(),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().allow(''),
}).unknown();

const { error: envError, value: env } = envSchema.validate(process.env);
if (envError) {
  // eslint-disable-next-line no-console
  console.error(`Environment configuration error: ${envError.message}`);
  process.exit(1);
}

const app = express();

// Security and performance middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false // Adjust as needed for API endpoints or set custom CSP
}));
app.use(cors({
  origin: env.CORS_ORIGIN || '*',
  methods: ['POST'],
}));
app.use(express.json());
app.use(compression());

// Rate limiting (per IP)
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Logger with daily rotation and error/info separation
const { createLogger, format, transports } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({ format: format.simple() }),
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'info',
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'error',
    }),
  ],
});

// Pi Network instance
const pi = new PiNetwork(env.PI_API_KEY, env.PI_WALLET_SECRET);

// Request validation schema
const paymentSchema = Joi.object({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,32}$/)
    .required()
    .messages({
      'string.pattern.base': 'Username must be 3-32 characters, alphanumeric or underscore.'
    }),
  amount: Joi.number().positive().precision(2).required(),
  metadata: Joi.object().optional(),
});

// Centralized validation middleware
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map(e => e.message) });
  }
  next();
};

// Main API endpoint
app.post(
  '/create-payment',
  paymentLimiter,
  validateBody(paymentSchema),
  async (req, res, next) => {
    try {
      const { username, amount, metadata } = req.body;
      const payment = await pi.createPayment({
        amount,
        memo: `Payment from ${username}`,
        metadata,
      });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
);

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler with safe logging (never leak secrets)
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({ error: 'Internal server error.' });
});

// Start server
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully.`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => shutdown(sig)));
