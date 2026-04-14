const prisma = require('../utils/prisma');

const getAllProducts = async () => {
    return await prisma.product.findMany({
        include: { user: { select: { name: true, email: true } } },
    });
};

const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { user: { select: { name: true, email: true } } },
    });

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    return product;
};

const createProduct = async (productData, userId) => {
    const { name, price, description } = productData;
    return await prisma.product.create({
        data: {
            name,
            price: parseFloat(price),
            description,
            userId,
        },
    });
};

const updateProduct = async (id, productData, userId) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.userId !== userId) {
        const error = new Error('Not authorized to update this product');
        error.statusCode = 403;
        throw error;
    }

    return await prisma.product.update({
        where: { id },
        data: {
            name: productData.name || product.name,
            price: productData.price ? parseFloat(productData.price) : product.price,
            description: productData.description || product.description,
        },
    });
};

const deleteProduct = async (id, userId) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.userId !== userId) {
        const error = new Error('Not authorized to delete this product');
        error.statusCode = 403;
        throw error;
    }

    return await prisma.product.delete({ where: { id } });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
