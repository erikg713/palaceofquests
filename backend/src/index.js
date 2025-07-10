require('dotenv').config();
const express = require('express');
const cors = require('cors');
const questRoutes = require('./routes/quests');

const app = express();
app.use(cors(), express.json());

app.use('/api/quests', questRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
