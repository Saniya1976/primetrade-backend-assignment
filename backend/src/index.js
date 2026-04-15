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
        });
    } catch (error) {
        logger.error('❌ Database connection failed: %s', error.message);
        // Continue running the server even if DB fails, or exit? 
        // Usually better to log it and decide based on app needs.
        // For this case, I'll let it run but with a warning.
        app.listen(PORT, () => {
            logger.warn(`🚀 Server is running on port ${PORT} (Database disconnected)`);
        });
    }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
