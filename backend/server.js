const express = require('express');
const cors = require('cors');
const { loginUser } = require('./auth');
const players = require('./routes/players');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const logger = require('./utils/logger');

const app = express();

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});
const app = express();
app.use('/payment', require('./routes/payment'));

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth/pi', loginUser);
app.use('/players', players);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
// backend/app.js
const express = require('express');
const { httpLogger, logger } = require('./utils/logger');

const app = express();

app.use(httpLogger); // HTTP request logging

app.get('/health', (req, res) => {
  logger.info({ route: '/health' }, 'Health check endpoint hit');
  res.json({ status: 'ok' });
});

// ... other routes

// Error handling (logs errors)
app.use((err, req, res, next) => {
  logger.error({ err, url: req.url }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
