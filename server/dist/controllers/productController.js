"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesController = exports.getProductBySlugController = exports.getProductsController = void 0;
const productService_js_1 = require("../services/productService.js");
const getProductsController = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, sort, q, page, limit } = req.query;
        const result = await productService_js_1.productService.getProducts({
            category: category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            sort: sort,
            q: q,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 8,
        });
        res.status(200).json({
            status: 'success',
            ...result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductsController = getProductsController;
const getProductBySlugController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await productService_js_1.productService.getProductBySlug(slug);
        if (!product) {
            res.status(404).json({
                status: 'fail',
                message: `Product with slug "${slug}" not found.`,
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductBySlugController = getProductBySlugController;
const getCategoriesController = async (_req, res, next) => {
    try {
        const categories = await productService_js_1.productService.getCategories();
        res.status(200).json({
            status: 'success',
            categories,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoriesController = getCategoriesController;
