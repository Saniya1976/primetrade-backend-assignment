const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Use the database connection pooling
const connectionString = process.env.DATABASE_URL;
console.log('🔗 Database connection string:', connectionString ? 'Configured' : 'MISSING');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
