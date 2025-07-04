// backend/server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const players = require('./routes/players');
const payment = require('./routes/payment');
const auth = require('./routes/auth');
const { httpLogger, logger } = require('./utils/logger');
const { loginUser } = require('./auth');

const app = express();

// HTTP request logging
app.use(httpLogger);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info({ route: '/health' }, 'Health check endpoint hit');
  res.json({ status: 'ok' });
});

// Auth endpoints
app.use('/auth', auth);
app.post('/auth/pi', loginUser);

// Player and payment endpoints
app.use('/players', players);
app.use('/payment', payment);

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error({ err, url: req.url }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
