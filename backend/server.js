const express = require('express');
const cors = require('cors');
const { loginUser } = require('./auth');
const players = require('./routes/players');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth/pi', loginUser);
app.use('/players', players);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
