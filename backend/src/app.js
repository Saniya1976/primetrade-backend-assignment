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

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: "*"
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(hpp());

// Routes v1
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}`, healthRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/products`, productRoutes);

app.get('/', (req, res) => {
    res.send('PrimeTrade API is running (v1)...');
});

// Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
