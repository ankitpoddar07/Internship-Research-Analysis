// Real-time order tracking interface
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Order } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OrderTrackingScreenProps {
  order: Order;
  onBackToHome: () => void;
  accessToken: string | null;
}

const trackingSteps = [
  { id: 'placed', label: 'Order Placed', icon: '✅', description: 'Your order has been placed successfully' },
  { id: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Restaurant is preparing your food' },
  { id: 'on-the-way', label: 'On the way', icon: '🏍️', description: 'Delivery partner is coming to you' },
  { id: 'delivered', label: 'Delivered', icon: '🎉', description: 'Order delivered successfully' }
];

export function OrderTrackingScreen({ order: initialOrder, onBackToHome, accessToken }: OrderTrackingScreenProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [deliveryPartner] = useState({
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    rating: 4.8
  });

  useEffect(() => {
    // Poll for order status updates
    const pollInterval = setInterval(async () => {
      if (accessToken && order.status !== 'delivered') {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-9850631d/orders/${order.id}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            setOrder(result.order);
          }
        } catch (error) {
          console.error('Error polling order status:', error);
        }
      }
    }, 5000); // Poll every 5 seconds

    // Simulate order status progression for demo
    const timer1 = setTimeout(async () => {
      if (accessToken) {
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-9850631d/orders/${order.id}/status`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ status: 'on-the-way' }),
            }
          );
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      }
      setEstimatedTime(15);
    }, 8000);

    const timer2 = setTimeout(async () => {
      if (accessToken) {
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-9850631d/orders/${order.id}/status`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ status: 'delivered' }),
            }
          );
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      }
      setEstimatedTime(0);
    }, 20000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order.id, accessToken, order.status]);

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex(step => step.id === order.status) >= 0 
      ? trackingSteps.findIndex(step => step.id === order.status)
      : trackingSteps.findIndex(step => step.id === 'preparing');
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Order #{order.id.slice(-6)}</h1>
            <p className="opacity-90">
              {estimatedTime > 0 ? `Arriving in ${estimatedTime} mins` : 'Delivered!'}
            </p>
          </div>
          <div className="text-2xl">🍽️</div>
        </div>
      </div>

      {/* Map/Location Section */}
      <div className="p-4 bg-gray-50">
        <div className="bg-green-100 rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-green-700 font-semibold">Live Tracking</p>
          <p className="text-green-600 text-sm">Your delivery partner is on the way</p>
          {order.status === 'on-the-way' && (
            <div className="mt-3 bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    🏍️
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{deliveryPartner.name}</p>
                    <p className="text-sm text-gray-600">⭐ {deliveryPartner.rating}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600"
                >
                  📞 Call
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Status */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="font-semibold mb-4">Order Status</h2>
        
        <div className="space-y-4">
          {trackingSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (isCurrent ? step.icon : '✓') : step.icon}
                </div>
                
                <div className="flex-1">
                  <div className={`font-semibold ${
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                  <div className={`text-sm ${
                    isCompleted ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </div>
                  {isCurrent && estimatedTime > 0 && (
                    <div className="text-xs text-orange-600 mt-1">
                      ETA: {estimatedTime} minutes
                    </div>
                  )}
                </div>
                
                {isCompleted && (
                  <div className="text-xs text-green-500">
                    {index === 0 ? new Date(order.timestamp || Date.now()).toLocaleTimeString() : 'Just now'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Order Items */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Order Details</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p className="text-sm text-gray-600">{order.deliveryAddress || order.delivery_address}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-white border-t border-gray-200 space-y-3">
        {order.status === 'delivered' ? (
          <Button
            onClick={onBackToHome}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
          >
            Order Again
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full py-3 rounded-xl border-orange-500 text-orange-500"
            >
              Need Help?
            </Button>
            <Button
              onClick={onBackToHome}
              variant="ghost"
              className="w-full text-gray-600"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}