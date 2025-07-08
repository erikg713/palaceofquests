const cors = require('cors');

// Allow origins from Pi Browser, Unity WebGL, Vercel frontend, local dev, etc.
const allowedOrigins = [
  'https://sandbox.minepi.com',
  'https://minepi.com',
  'https://palaceofquests.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173', // Vite
  'http://127.0.0.1:5173',
  'unity-player://',       // For Unity WebGL
];

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    // Allow no origin (e.g., curl, Pi browser)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Blocked by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-pi-auth'],
  exposedHeaders: ['Authorization'],
};

module.exports = cors(corsOptions);

