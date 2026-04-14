const prisma = require('../utils/prisma');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            include: { user: { select: { name: true, email: true } } },
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { user: { select: { name: true, email: true } } },
        });

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
    const { name, price, description } = req.body;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                userId: req.user.id,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
    const { name, price, description } = req.body;

    try {
        const product = await prisma.product.findUnique({ where: { id: req.params.id } });

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check if user is owner or admin
        if (product.userId !== req.user.id && req.user.role !== 'ADMIN') {
            res.status(403);
            throw new Error('Not authorized to update this product');
        }

        const updatedProduct = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                name: name || product.name,
                price: price ? parseFloat(price) : product.price,
                description: description || product.description,
            },
        });

        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({ where: { id: req.params.id } });

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Only admin can delete for now, or owner
        if (product.userId !== req.user.id && req.user.role !== 'ADMIN') {
            res.status(403);
            throw new Error('Not authorized to delete this product');
        }

        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
