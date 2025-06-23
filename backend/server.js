require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Joi = require('joi');
const winston = require('winston');
const PiNetwork = require('pi-backend');
const rateLimit = require('express-rate-limit');

const REQUIRED_ENVS = ['PI_API_KEY', 'PI_WALLET_SECRET'];
for (const key of REQUIRED_ENVS) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['POST'] }));
app.use(express.json());

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

const pi = new PiNetwork(process.env.PI_API_KEY, process.env.PI_WALLET_SECRET);

// Rate limiting
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});

// Validation middleware
const paymentSchema = Joi.object({
  username: Joi.string().trim().min(3).max(32).required(),
  amount: Joi.number().positive().precision(2).required(),
  metadata: Joi.object().optional(),
});

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(e => e.message).join(', ') });
    }
    next();
  };
}

// Routes
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

// Error handling
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

// Server setup and graceful shutdown
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  logger.info(`Pi SDK server running on port ${PORT}`);
});

function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully.`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => shutdown(sig)));
