const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

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
 * CORS CONFIG (IMPORTANT FIX)
 */
app.use(cors({
  origin: [
    "https://primetrade-backend-assignment-front.vercel.app",
    "http://localhost:3000"
  ],
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

/**
 * ERROR HANDLERS
 */
app.use(notFound);
app.use(errorHandler);

module.exports = app;