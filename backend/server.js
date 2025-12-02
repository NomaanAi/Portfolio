require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Connect to DB
connectDB(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/homepage', require('./routes/homepageRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
