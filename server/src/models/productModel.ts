import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProductSize = string;
export type ProductColor = string;

export interface IProductVariant {
  id: string;
  sku: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  featuredImage: string;
  minPrice: number;
  maxPrice: number;
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    id: { type: String, required: true },
    sku: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    inStock: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String, required: true }],
    featuredImage: { type: String, required: true },
    minPrice: { type: Number, required: true, index: true },
    maxPrice: { type: Number, required: true },
    variants: [variantSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ category: 1, minPrice: 1 });
productSchema.index({ createdAt: -1 });

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
