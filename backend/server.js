require('dotenv').config(); // Load env early

const express = require('express');
const corsMiddleware = require('./middleware/corsMiddleware');
const { httpLogger, logger } = require('./utils/logger');

const auth = require('./routes/auth');
const players = require('./routes/players');
const payment = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const { loginUser } = require('./auth');

const app = express();

// 🔹 Logging
app.use(httpLogger);

// 🔹 Secure CORS
app.use(corsMiddleware);

// 🔹 JSON body parsing
app.use(express.json());

// 🔹 Health check
app.get('/health', (req, res) => {
  logger.info({ route: '/health' }, 'Health check endpoint hit');
  res.json({ status: 'ok' });
});

// 🔹 Auth endpoints
app.use('/auth', auth);
app.post('/auth/pi', loginUser);

// 🔹 Game + Payment routes
app.use('/players', players);
app.use('/payment', payment);

// 🔹 User profile route
app.use('/api/users', userRoutes);

// 🔹 Centralized error handling
app.use((err, req, res, next) => {
  logger.error({ err, url: req.url }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`⚔️ Server running on port ${PORT}`);
});

module.exports = app;
