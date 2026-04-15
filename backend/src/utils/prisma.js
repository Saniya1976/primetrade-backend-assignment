const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Use the database connection pooling
const connectionString = process.env.DATABASE_URL;
logger.info('🔗 Database connection status: %s', connectionString ? 'Configured' : 'MISSING');
const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
