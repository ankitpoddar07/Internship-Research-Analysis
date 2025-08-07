// Details and menu for selected restaurant
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Restaurant, FoodItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (item: FoodItem, restaurantId: string) => void;
  cartItemCount: number;
  onNavigateToCart: () => void;
}

export function RestaurantScreen({ 
  restaurant, 
  onBack, 
  onAddToCart, 
  cartItemCount, 
  onNavigateToCart 
}: RestaurantScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get unique categories from menu items
  const categories = ['all', ...Array.from(new Set(restaurant.items.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'all' 
    ? restaurant.items 
    : restaurant.items.filter(item => item.category === selectedCategory);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-white bg-opacity-90 rounded-full w-10 h-10 p-0"
          >
            ←
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToCart}
            className="bg-white bg-opacity-90 rounded-full w-10 h-10 p-0 relative"
          >
            🛒
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h1 className="text-white text-xl font-bold">{restaurant.name}</h1>
          <p className="text-white opacity-90">{restaurant.cuisine}</p>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
            ⭐ {restaurant.rating}
          </span>
          <span className="text-gray-600 text-sm">
            🕒 {restaurant.deliveryTime}
          </span>
          <span className="text-gray-600 text-sm">
            🚚 Free delivery
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600'
              }`}
            >
              {category === 'all' ? 'All Items' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-lg font-bold text-orange-500 mt-2">₹{item.price}</p>
                  
                  <Button
                    onClick={() => onAddToCart(item, restaurant.id)}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                  >
                    Add to Cart
                  </Button>
                </div>
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button (if items in cart) */}
      {cartItemCount > 0 && (
        <div className="p-4 bg-white border-t border-gray-200">
          <Button
            onClick={onNavigateToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
          >
            View Cart ({cartItemCount} items)
          </Button>
        </div>
      )}
    </div>
  );
}