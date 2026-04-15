const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const path = require('path'); // IMPORTANT: Add this

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

app.use(helmet());
app.use(limiter);

/**
 * CORS CONFIG - Simplified for same domain
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(hpp());

/**
 * API ROUTES
 */
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}`, healthRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/products`, productRoutes);

/**
 * ROOT CHECK
 */
app.get('/', (req, res) => {
  res.send('🚀 PrimeTrade API is running (v1)');
});

// ==========================================
// SERVE FRONTEND (SCENARIO 1)
// ==========================================
if (process.env.NODE_ENV === 'production') {
  // Path to your built Next.js app
  const frontendPath = path.join(__dirname, '../../frontend/out');
  
  console.log(`📦 Serving frontend from: ${frontendPath}`);
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Handle client-side routing - all non-API routes go to index.html
  app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

/**
 * ERROR HANDLERS
 */
app.use(notFound);
app.use(errorHandler);

module.exports = app;