// List of user's previous orders
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Order } from '../App';
import { projectId } from '../utils/supabase/info';

interface OrderHistoryScreenProps {
  onBack: () => void;
  accessToken: string | null;
}

export function OrderHistoryScreen({ onBack, accessToken }: OrderHistoryScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const fetchOrders = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9850631d/orders`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Convert backend orders to frontend format
        const formattedOrders = result.orders.map((order: any) => ({
          ...order,
          timestamp: new Date(order.created_at).getTime(),
          deliveryAddress: order.delivery_address,
        }));
        setOrders(formattedOrders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'on-the-way': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'on-the-way': return 'On the way';
      case 'preparing': return 'Preparing';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white flex flex-col">
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
            <h1 className="text-xl font-semibold">Order History</h1>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
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
            <h1 className="text-xl font-semibold">Order History</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Your order history will appear here</p>
          <Button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl"
          >
            Start Ordering
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
          <h1 className="text-xl font-semibold">Order History</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.timestamp).toLocaleDateString()} • {new Date(order.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-1 mb-3">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500">
                    +{order.items.length - 2} more items
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Total: ₹{order.total}</p>
                  <p className="text-sm text-gray-600">{order.items.length} items</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-500 border-orange-500"
                  >
                    Reorder
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}