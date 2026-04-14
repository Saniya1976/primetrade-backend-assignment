const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validateMiddleware');
const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;
