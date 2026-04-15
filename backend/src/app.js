const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

app.use(helmet());
app.use(limiter);

// ❌ CORS NOT NEEDED for same-domain! Remove or keep only for local dev
// Only keep if you need to support multiple origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(hpp());

// API Routes
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}`, healthRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/products`, productRoutes);

// Root check
app.get('/', (req, res) => {
  res.send('🚀 PrimeTrade API is running (v1)');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/out');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;