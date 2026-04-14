const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, productSchema } = require('../middleware/validateMiddleware');
const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, validate(productSchema), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, validate(productSchema), updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
