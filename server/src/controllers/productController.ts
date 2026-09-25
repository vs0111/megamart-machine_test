import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, sort, q, page, limit } = req.query;

    const result = await productService.getProducts({
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as any,
      q: q as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 8,
    });

    res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

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
  } catch (error) {
    next(error);
  }
};

export const getCategoriesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await productService.getCategories();
    res.status(200).json({
      status: 'success',
      categories,
    });
  } catch (error) {
    next(error);
  }
};
