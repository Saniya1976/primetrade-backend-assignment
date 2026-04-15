const app = require('./app');
const prisma = require('./utils/prisma');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('❌ Database connection failed: %s', error.message);
        // Continue running the server even if DB fails
        app.listen(PORT, () => {
            logger.warn(`🚀 Server is running on port ${PORT} (⚠️ Database disconnected)`);
        });
    }
}

startServer();

// Handle graceful shutdown
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