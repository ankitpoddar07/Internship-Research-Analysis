// Shopping cart interface
import React from 'react';
import { Button } from './ui/button';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onProceedToCheckout: () => void;
}

export function CartScreen({ cart, onBack, onUpdateQuantity, onProceedToCheckout }: CartScreenProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + taxes;

  if (cart.length === 0) {
    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-0"
            >
              ←
            </Button>
            <h1 className="text-xl font-semibold">Cart</h1>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
          <Button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl"
          >
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0"
          >
            ←
          </Button>
          <h1 className="text-xl font-semibold">Cart ({cart.length} items)</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex space-x-3">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-orange-500 font-semibold">₹{item.price}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      -
                    </Button>
                    <span className="font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, 0)}
                    className="text-red-500 text-xs mt-1"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Bill Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>₹{taxes}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          onClick={onProceedToCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
        >
          Proceed to Checkout - ₹{total}
        </Button>
      </div>
    </div>
  );
}