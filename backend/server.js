const express = require('express');
const cors = require('cors');
const { loginUser } = require('./auth');
const players = require('./routes/players');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

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
