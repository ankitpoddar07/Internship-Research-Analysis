// Main application component (React Entry Point)
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { RestaurantScreen } from './components/RestaurantScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';
import { DatabaseInfo } from './components/DatabaseInfo';
import { supabase } from './utils/supabase';
import { projectId } from './utils/supabase/info';

export type Screen = 'welcome' | 'auth' | 'home' | 'restaurant' | 'cart' | 'checkout' | 'tracking' | 'profile' | 'history' | 'database';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'on-the-way' | 'delivered';
  timestamp: number;
  deliveryAddress: string;
  user_id?: string;
  created_at?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    checkAuthStatus();
    
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has an active session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          phone: session.user.user_metadata?.phone || '',
        };
        
        setUser(userData);
        setAccessToken(session.access_token);
        setCurrentScreen('home');
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('foodease_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } else {
        setCurrentScreen('welcome');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setCurrentScreen('welcome');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('foodease_cart', JSON.stringify(cart));
  }, [cart]);

  const signUpUser = async (userData: { name: string; email: string; phone: string; password: string }) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: userData.name,
          phone: userData.phone,
        };
        
        setUser(newUser);
        setAccessToken(data.session.access_token);
        setCurrentScreen('home');
        return newUser;
      } else {
        throw new Error('Signup successful but no session created');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const signInUser = async (credentials: { email: string; password: string }) => {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'User',
          phone: data.user.user_metadata?.phone || '',
        };
        
        setUser(userData);
        setAccessToken(data.session.access_token);
        setCurrentScreen('home');
        return userData;
      } else {
        throw new Error('Sign in successful but no session created');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    }
  };

  const createOrder = async (orderData: { items: CartItem[]; total: number; delivery_address: string }) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9850631d/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Order creation failed');
      }

      return result.order;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  const addToCart = (item: FoodItem, restaurantId: string) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId,
      image: item.image
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, cartItem];
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('foodease_cart');
      setUser(null);
      setAccessToken(null);
      setCart([]);
      setCurrentScreen('welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const placeOrder = async (orderDetails: { items: CartItem[]; total: number; deliveryAddress: string }) => {
    try {
      const order = await createOrder({
        items: orderDetails.items,
        total: orderDetails.total,
        delivery_address: orderDetails.deliveryAddress,
      });

      const orderWithTimestamp: Order = {
        ...order,
        timestamp: new Date(order.created_at).getTime(),
        deliveryAddress: order.delivery_address,
      };

      setCurrentOrder(orderWithTimestamp);
      clearCart();
      setCurrentScreen('tracking');
    } catch (error) {
      console.error('Place order error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-600">Loading FoodEase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="w-full max-w-sm mx-auto bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] h-[800px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="bg-white h-6 flex items-center justify-between px-6 text-black text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              {/* WiFi Indicator */}
              <div className={`flex items-center ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.65-4.35-1.65-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.86 9.14 5 13z"/>
                </svg>
              </div>
              {/* Battery */}
              <div className="w-4 h-2 border border-black rounded-sm">
                <div className="w-3 h-1 bg-black rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="h-[774px] overflow-hidden">
            {currentScreen === 'welcome' && (
              <WelcomeScreen onGetStarted={() => setCurrentScreen('auth')} />
            )}
            {currentScreen === 'auth' && (
              <AuthScreen 
                onLogin={signInUser}
                onSignUp={signUpUser}
              />
            )}
            {currentScreen === 'home' && (
              <HomeScreen 
                user={user}
                cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                onSelectRestaurant={(restaurant) => {
                  setSelectedRestaurant(restaurant);
                  setCurrentScreen('restaurant');
                }}
                onNavigateToCart={() => setCurrentScreen('cart')}
                onNavigateToProfile={() => setCurrentScreen('profile')}
              />
            )}
            {currentScreen === 'restaurant' && selectedRestaurant && (
              <RestaurantScreen 
                restaurant={selectedRestaurant}
                onBack={() => setCurrentScreen('home')}
                onAddToCart={addToCart}
                cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                onNavigateToCart={() => setCurrentScreen('cart')}
              />
            )}
            {currentScreen === 'cart' && (
              <CartScreen 
                cart={cart}
                onBack={() => {
                  if (selectedRestaurant) {
                    setCurrentScreen('restaurant');
                  } else {
                    setCurrentScreen('home');
                  }
                }}
                onUpdateQuantity={updateCartItemQuantity}
                onProceedToCheckout={() => setCurrentScreen('checkout')}
              />
            )}
            {currentScreen === 'checkout' && (
              <CheckoutScreen 
                cart={cart}
                user={user}
                onBack={() => setCurrentScreen('cart')}
                onPlaceOrder={placeOrder}
              />
            )}
            {currentScreen === 'tracking' && currentOrder && (
              <OrderTrackingScreen 
                order={currentOrder}
                onBackToHome={() => setCurrentScreen('home')}
                accessToken={accessToken}
              />
            )}
            {currentScreen === 'profile' && user && (
              <ProfileScreen 
                user={user}
                onBack={() => setCurrentScreen('home')}
                onNavigateToHistory={() => setCurrentScreen('history')}
                onNavigateToDatabase={() => setCurrentScreen('database')}
                onLogout={logout}
              />
            )}
            {currentScreen === 'history' && (
              <OrderHistoryScreen 
                onBack={() => setCurrentScreen('profile')}
                accessToken={accessToken}
              />
            )}
            {currentScreen === 'database' && (
              <DatabaseInfo 
                onBack={() => setCurrentScreen('profile')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}