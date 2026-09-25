import { ProductModel, IProduct } from '../models/productModel.js';

export interface ProductQueryFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  q?: string;
  page?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Fetch paginated product listing from MongoDB with search, category filter, price range, and sorting.
   */
  public async getProducts(filters: ProductQueryFilters = {}) {
    const query: any = {};

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
    let sortOptions: any = { createdAt: -1 };
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

    const total = await ProductModel.countDocuments(query);
    const products = await ProductModel.find(query)
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
  public async getProductBySlug(slug: string) {
    const product = await ProductModel.findOne({ slug });
    return product ? product.toJSON() : null;
  }

  /**
   * Get list of unique product categories available in MongoDB.
   */
  public async getCategories(): Promise<string[]> {
    const categories = await ProductModel.distinct('category');
    return categories.sort();
  }

  /**
   * Seed database with initial products if empty.
   */
  public async seedInitialProducts(products: Partial<IProduct>[]) {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding products into MongoDB Atlas...');
      await ProductModel.insertMany(products);
      console.log(`✅ Successfully seeded ${products.length} products into MongoDB Atlas!`);
    }
  }
}

export const productService = new ProductService();
