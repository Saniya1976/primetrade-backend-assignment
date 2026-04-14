const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!req.user) {
            res.status(401);
            return next(new Error('User not found'));
        }

        next();
    } catch (error) {
        res.status(401);
        next(new Error('Not authorized, token failed'));
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403);
        next(new Error('Not authorized as an admin'));
    }
};

module.exports = { protect, admin };
