const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        res.status(400);
        return next(error);
    }
};

// Auth Schemas
const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['USER', 'ADMIN']).optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

// Product Schemas
const productSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Product name must be at least 2 characters'),
        price: z.number().positive('Price must be a positive number'),
        description: z.string().optional(),
    }),
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    productSchema,
};
