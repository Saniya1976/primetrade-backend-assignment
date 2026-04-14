const app = require('./app');
const prisma = require('./utils/prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error.message);
        // Continue running the server even if DB fails, or exit? 
        // Usually better to log it and decide based on app needs.
        // For this case, I'll let it run but with a warning.
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT} (Database disconnected)`);
        });
    }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
