const productService = require('../services/productService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
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
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body, req.user.id);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body, req.user.id);
        res.json(updatedProduct);
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id, req.user.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
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
