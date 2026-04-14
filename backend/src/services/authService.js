const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const generateToken = require('../utils/generateToken');

/**
 * @desc Business logic for user registration
 */
const register = async (userData) => {
    const { name, email, password, role } = userData;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER',
        },
    });
};

/**
 * @desc Business logic for user login
 */
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error('No user found with this email address');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Incorrect password. Please try again.');
        error.statusCode = 401;
        throw error;
    }

    return user;
};

module.exports = {
    register,
    login
};
