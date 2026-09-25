"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const productModel_js_1 = require("../models/productModel.js");
class ProductService {
    /**
     * Fetch paginated product listing from MongoDB with search, category filter, price range, and sorting.
     */
    async getProducts(filters = {}) {
        const query = {};
        // 1. Search Query Filter (q)
        if (filters.q && filters.q.trim()) {
            const searchRegex = new RegExp(filters.q.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
            ];
        }
        // 2. Category Filter
        if (filters.category && filters.category.trim() && filters.category.toLowerCase() !== 'all') {
            query.category = new RegExp(`^${filters.category.trim()}$`, 'i');
        }
        // 3. Price Range Filter (minPrice & maxPrice)
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.minPrice = {};
            if (filters.minPrice !== undefined) {
                query.minPrice.$gte = Number(filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                query.minPrice.$lte = Number(filters.maxPrice);
            }
        }
        // 4. Sorting
        let sortOptions = { createdAt: -1 };
        if (filters.sort) {
            switch (filters.sort) {
                case 'price_asc':
                    sortOptions = { minPrice: 1 };
                    break;
                case 'price_desc':
                    sortOptions = { minPrice: -1 };
                    break;
                case 'name_asc':
                    sortOptions = { name: 1 };
                    break;
                case 'newest':
                default:
                    sortOptions = { createdAt: -1 };
                    break;
            }
        }
        // 5. Pagination
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(filters.limit) || 8));
        const skip = (page - 1) * limit;
        const total = await productModel_js_1.ProductModel.countDocuments(query);
        const products = await productModel_js_1.ProductModel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            data: products.map((p) => p.toJSON()),
            pagination: {
                total,
                page,
                totalPages,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    /**
     * Fetch single product detail by slug from MongoDB.
     */
    async getProductBySlug(slug) {
        const product = await productModel_js_1.ProductModel.findOne({ slug });
        return product ? product.toJSON() : null;
    }
    /**
     * Get list of unique product categories available in MongoDB.
     */
    async getCategories() {
        const categories = await productModel_js_1.ProductModel.distinct('category');
        return categories.sort();
    }
    /**
     * Seed database with initial products if empty.
     */
    async seedInitialProducts(products) {
        const count = await productModel_js_1.ProductModel.countDocuments();
        if (count === 0) {
            console.log('🌱 Seeding products into MongoDB Atlas...');
            await productModel_js_1.ProductModel.insertMany(products);
            console.log(`✅ Successfully seeded ${products.length} products into MongoDB Atlas!`);
        }
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
