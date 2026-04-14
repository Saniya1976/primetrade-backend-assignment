const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validateMiddleware');
const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/signup', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/signin', validate(loginSchema), loginUser);
router.get('/logout', logoutUser);

module.exports = router;
