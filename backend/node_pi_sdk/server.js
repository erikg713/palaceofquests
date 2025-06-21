require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const Joi = require('joi');
const winston = require('winston');
const PiNetwork = require('pi-backend');

const app = express();
app.use(express.json());
app.use(helmet());

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

// Environment variable validation
if (!process.env.PI_API_KEY || !process.env.PI_WALLET_SECRET) {
    logger.error('Missing required environment variables: PI_API_KEY and/or PI_WALLET_SECRET');
    process.exit(1);
}

const pi = new PiNetwork(process.env.PI_API_KEY, process.env.PI_WALLET_SECRET);

// Input validation schema
const paymentSchema = Joi.object({
    username: Joi.string().required(),
    amount: Joi.number().positive().required(),
    metadata: Joi.object().optional()
});

// Async handler for routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.post('/create-payment', asyncHandler(async (req, res) => {
    const { error } = paymentSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, amount, metadata } = req.body;
    const payment = await pi.createPayment({
        amount,
        memo: `Payment from ${username}`,
        metadata
    });

    res.json(payment);
}));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Server setup
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Pi SDK server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing server gracefully.');
    server.close(() => {
        console.log('Server closed');
    });
});
