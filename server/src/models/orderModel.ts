import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface IShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'upi' | 'card' | 'cod' | string;
}

export interface IOrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: IOrderItem[];
  summary: IOrderSummary;
  shippingDetails: IShippingDetails;
  paymentStatus: string;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const shippingDetailsSchema = new Schema<IShippingDetails>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    paymentMethod: { type: String, required: true, default: 'upi' },
  },
  { _id: false }
);

const orderSummarySchema = new Schema<IOrderSummary>(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    itemCount: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    items: [orderItemSchema],
    summary: { type: orderSummarySchema, required: true },
    shippingDetails: { type: shippingDetailsSchema, required: true },
    paymentStatus: { type: String, required: true, default: 'PAID' },
    status: { type: String, required: true, default: 'PLACED' },
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

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
