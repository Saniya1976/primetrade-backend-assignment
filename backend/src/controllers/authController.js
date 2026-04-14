const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');

// Generate Token and Set Cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user.id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.status(statusCode).cookie('token', token, options).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        sendTokenResponse(user, 201, res);
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/signin
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        sendTokenResponse(user, 200, res);
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
