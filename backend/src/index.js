
const app = require('./app');
const prisma = require('./utils/prisma');
const logger = require('./utils/logger');
const path = require('path');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // Serve frontend in production
        if (process.env.NODE_ENV === 'production') {
            const frontendPath = path.join(__dirname, '../../frontend/out');
            
            // Serve static files
            app.use(express.static(frontendPath));
            
            // Handle client-side routing - all non-API routes go to index.html
            app.get('*', (req, res) => {
                if (!req.path.startsWith('/api')) {
                    res.sendFile(path.join(frontendPath, 'index.html'));
                }
            });
            
            logger.info('📦 Frontend static files configured');
        }

        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('❌ Database connection failed: %s', error.message);
        // Still serve frontend even if DB fails
        if (process.env.NODE_ENV === 'production') {
            const frontendPath = path.join(__dirname, '../../frontend/out');
            app.use(express.static(frontendPath));
            app.get('*', (req, res) => {
                if (!req.path.startsWith('/api')) {
                    res.sendFile(path.join(frontendPath, 'index.html'));
                }
            });
        }
        
        app.listen(PORT, () => {
            logger.warn(`🚀 Server is running on port ${PORT} (⚠️ Database disconnected)`);
        });
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('🛑 SIGTERM received, shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});