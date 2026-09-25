import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  Building2,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { cartService } from '../../services/cartService';
import type { CheckoutDetails, OrderConfirmation } from '../../types/cart';

interface CartPageProps {
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigateHome, onNavigateProducts }) => {
  const queryClient = useQueryClient();
  const {
    items,
    staleAlerts,
    updateQuantity,
    removeItem,
    clearCart,
    syncCartWithServer,
    clearStaleAlerts,
    getSummary,
  } = useCartStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  // Form state for checkout
  const [checkoutForm, setCheckoutForm] = useState<CheckoutDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutDetails, string>>>({});

  // Sync cart with server on initial render
  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      setIsSyncing(true);
      await syncCartWithServer();
      if (mounted) setIsSyncing(false);
    };
    sync();
    return () => {
      mounted = false;
    };
  }, []);

  const summary = getSummary();

  const validateCheckoutForm = (): boolean => {
    const errors: Partial<Record<keyof CheckoutDetails, string>> = {};
    if (!checkoutForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!checkoutForm.email.trim() || !checkoutForm.email.includes('@')) errors.email = 'Valid email is required';
    if (!checkoutForm.phone.trim() || checkoutForm.phone.length < 10) errors.phone = 'Valid 10-digit phone required';
    if (!checkoutForm.address.trim()) errors.address = 'Street address is required';
    if (!checkoutForm.city.trim()) errors.city = 'City is required';
    if (!checkoutForm.pincode.trim() || checkoutForm.pincode.length < 6) errors.pincode = 'Valid 6-digit pincode required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;

    setIsPlacingOrder(true);
    try {
      const confirmation = await cartService.checkout(checkoutForm);

      // Invalidate products queries so product listing and product detail show updated stock immediately!
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product'] });

      setOrderConfirmation(confirmation);
      await clearCart();
      setIsCheckoutOpen(false);

      Swal.fire({
        title: 'Order Placed Successfully!',
        text: `Your order #${confirmation.orderId} has been confirmed. Stock reserved in MongoDB Atlas!`,
        icon: 'success',
        confirmButtonColor: '#008ECC',
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Checkout Refused',
        text: err.message || 'Could not place order. Stock may have changed or item is out of stock.',
        icon: 'error',
        confirmButtonColor: '#008ECC',
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Order Success Screen View
  if (orderConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in-50">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Order Placed Successfully!</h1>
          <p className="text-sm text-slate-500 mb-6">
            Order ID: <span className="font-mono font-bold text-slate-800">{orderConfirmation.orderId}</span>
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-6 space-y-3 border border-slate-100 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-medium text-slate-800 text-right">
                {orderConfirmation.shippingDetails.fullName}, {orderConfirmation.shippingDetails.address},{' '}
                {orderConfirmation.shippingDetails.city} - {orderConfirmation.shippingDetails.pincode}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-medium text-slate-800 uppercase">
                {orderConfirmation.shippingDetails.paymentMethod} ({orderConfirmation.paymentStatus})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid:</span>
              <span className="font-extrabold text-[#008ECC]">
                ₹{orderConfirmation.summary.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onNavigateHome}
              className="bg-[#008ECC] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#007bb3] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-in fade-in-50">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our top deals and start shopping!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onNavigateProducts}
            className="bg-[#008ECC] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#007bb3] transition-colors shadow-sm"
          >
            Explore Products
          </button>
          <button
            onClick={onNavigateHome}
            className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Shopping Cart ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={onNavigateProducts}
          className="text-sm font-semibold text-[#008ECC] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      {/* Stale Stock Alerts Banner */}
      {staleAlerts.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Inventory Status Notice</p>
              <ul className="text-xs space-y-1 text-amber-800 list-disc pl-4">
                {staleAlerts.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={clearStaleAlerts}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const isMaxReached = item.quantity >= item.variant.stock;
            return (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs relative"
              >
                {/* Product Thumbnail */}
                <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                  <img
                    src={item.product.featuredImage || item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-900 truncate">{item.product.name}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 my-1">
                    <span>Option/Spec: <strong className="text-slate-700">{item.variant.size}</strong></span>
                    <span>•</span>
                    <span>Color/Finish: <strong className="text-slate-700">{item.variant.color}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">SKU: {item.variant.sku}</span>
                  </div>

                  {item.isStale && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded mt-1">
                      {item.staleMessage || 'Stock adjusted'}
                    </span>
                  )}

                  <div className="text-sm font-semibold text-slate-800 sm:hidden mt-2">
                    ₹{item.variant.price.toLocaleString('en-IN')} × {item.quantity} = ₹
                    {(item.variant.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Adjustment Controls */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isMaxReached}
                      className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={isMaxReached ? `Max stock reached (${item.variant.stock})` : 'Increase'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Single Item Total */}
                  <div className="hidden sm:block text-right min-w-24">
                    <div className="text-base font-bold text-slate-900">
                      ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-slate-400">
                      ₹{item.variant.price.toLocaleString('en-IN')} / ea
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
            <span className="text-xs text-slate-400">
              {isSyncing ? 'Synchronizing live stock...' : 'All item stocks verified'}
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{summary.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Savings</span>
                  <span className="font-semibold">
                    -₹{summary.discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (GST 5%)</span>
                <span className="font-semibold text-slate-900">
                  ₹{summary.tax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                {summary.shippingFee === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">
                    ₹{summary.shippingFee}
                  </span>
                )}
              </div>

              {summary.shippingFee > 0 && (
                <p className="text-[11px] text-slate-400 italic">
                  Add ₹{(501 - summary.subtotal).toLocaleString('en-IN')} more to qualify for Free Shipping!
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-[#008ECC] text-xl">
                  ₹{summary.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 bg-[#008ECC] hover:bg-[#007bb3] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-sm"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Shipping & Payment Details</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={checkoutForm.fullName}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                />
                {formErrors.fullName && <p className="text-xs text-rose-500 mt-1">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                  />
                  {formErrors.email && <p className="text-xs text-rose-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                  />
                  {formErrors.phone && <p className="text-xs text-rose-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  placeholder="Flat / House No., Building, Street Name"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                />
                {formErrors.address && <p className="text-xs text-rose-500 mt-1">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={checkoutForm.state}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={checkoutForm.pincode}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008ECC]/20 focus:border-[#008ECC]"
                  />
                  {formErrors.pincode && <p className="text-xs text-rose-500 mt-1">{formErrors.pincode}</p>}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI / Google Pay', icon: Building2 },
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = checkoutForm.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          setCheckoutForm({
                            ...checkoutForm,
                            paymentMethod: method.id as CheckoutDetails['paymentMethod'],
                          })
                        }
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-[#008ECC] bg-[#008ECC]/5 text-[#008ECC] font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="px-6 py-2.5 rounded-xl bg-[#008ECC] hover:bg-[#007bb3] text-white text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Stock & Placing Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay ₹{summary.total.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
