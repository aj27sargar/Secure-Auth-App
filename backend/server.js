const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./db');
const clientRoutes = require('./routes/clientRoutes');

require('dotenv').config();
const app = express();

app.use(morgan('dev'), cors(), bodyParser.json());
connectDB();

app.use('/api/clients', clientRoutes);
app.get('/', (req, res) => res.send('✅ Backend Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
