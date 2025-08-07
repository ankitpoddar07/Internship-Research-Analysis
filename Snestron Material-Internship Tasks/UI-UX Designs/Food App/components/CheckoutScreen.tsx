// Checkout and payment screen
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CartItem, User, Order } from '../App';

interface CheckoutScreenProps {
  cart: CartItem[];
  user: User | null;
  onBack: () => void;
  onPlaceOrder: (order: Order) => void;
}

export function CheckoutScreen({ cart, user, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('Home - 123 Main Street, Mumbai, 400001');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    // Validate payment details
    if (selectedPayment === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        alert('Please fill in all payment details');
        return;
      }
    }

    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      total,
      status: 'preparing',
      timestamp: Date.now(),
      deliveryAddress
    };

    // Save order to localStorage for order history
    const existingOrders = JSON.parse(localStorage.getItem('foodease_orders') || '[]');
    localStorage.setItem('foodease_orders', JSON.stringify([order, ...existingOrders]));

    onPlaceOrder(order);
  };

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
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Delivery Address */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          <div className="flex items-start space-x-3">
            <span className="text-lg">📍</span>
            <div className="flex-1">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-600 text-sm">{deliveryAddress}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-500 p-0 mt-2"
              >
                Change Address
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          
          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <div
              className={`border rounded-lg p-3 cursor-pointer ${
                selectedPayment === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPayment('card')}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">💳</span>
                <span>Credit/Debit Card</span>
              </div>
            </div>

            {/* UPI */}
            <div
              className={`border rounded-lg p-3 cursor-pointer ${
                selectedPayment === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPayment('upi')}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">📱</span>
                <span>UPI</span>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div
              className={`border rounded-lg p-3 cursor-pointer ${
                selectedPayment === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPayment('cod')}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">💰</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          {selectedPayment === 'card' && (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Doe"
                  value={paymentDetails.nameOnCard}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, nameOnCard: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {selectedPayment === 'upi' && (
            <div className="mt-4">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="example@paytm"
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 pt-2 mt-2">
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
              <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
        >
          Place Order - ₹{total}
        </Button>
      </div>
    </div>
  );
}