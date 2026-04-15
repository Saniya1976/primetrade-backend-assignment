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

// Rate Limiting - apply only to API routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(hpp());
app.use(morgan('dev'));

// Apply rate limiter to API routes only
app.use('/api', limiter);

// CORS - only needed for local development
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
}

// API Routes
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}`, healthRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/products`, productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Serve frontend in production (Scenario 1)
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/out');

    // Check if frontend build exists
    const fs = require('fs');
    if (fs.existsSync(frontendPath)) {
        console.log(`✅ Serving frontend from: ${frontendPath}`);
        app.use(express.static(frontendPath));

        // Handle client-side routing - all non-API routes go to index.html
        app.get('*path', (req, res) => {
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(frontendPath, 'index.html'));
            }
        });
    } else {
        console.warn(`⚠️ Frontend build not found at: ${frontendPath}`);
    }
}

// 404 handler for API routes
app.use('/api/*path', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;