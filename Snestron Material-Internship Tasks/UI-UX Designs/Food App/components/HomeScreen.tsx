// Home screen for browsing restaurants
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { User, Restaurant } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  user: User | null;
  cartItemCount: number;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNavigateToCart: () => void;
  onNavigateToProfile: () => void;
}

const categories = [
  { id: '1', name: 'Pizza', emoji: '🍕', color: 'bg-red-100' },
  { id: '2', name: 'Burger', emoji: '🍔', color: 'bg-yellow-100' },
  { id: '3', name: 'Chinese', emoji: '🥡', color: 'bg-orange-100' },
  { id: '4', name: 'Biryani', emoji: '🍚', color: 'bg-green-100' },
  { id: '5', name: 'Desserts', emoji: '🍰', color: 'bg-pink-100' },
  { id: '6', name: 'Healthy', emoji: '🥗', color: 'bg-blue-100' },
  { id: '7', name: 'Mexican', emoji: '🌮', color: 'bg-purple-100' },
  { id: '8', name: 'Sandwich', emoji: '🥪', color: 'bg-indigo-100' }
];

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Domino's Pizza",
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
    rating: 4.2,
    deliveryTime: '25-30 mins',
    cuisine: 'Pizza, Italian',
    items: [
      {
        id: '1',
        name: 'Margherita Pizza',
        price: 299,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
        description: 'Classic pizza with fresh basil and mozzarella',
        category: 'Pizza'
      },
      {
        id: '2', 
        name: 'Pepperoni Pizza',
        price: 399,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
        description: 'Loaded with pepperoni and cheese',
        category: 'Pizza'
      },
      {
        id: '3',
        name: 'Chicken Supreme Pizza',
        price: 449,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        description: 'Loaded with chicken, vegetables and cheese',
        category: 'Pizza'
      }
    ]
  },
  {
    id: '2',
    name: 'KFC',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop',
    rating: 4.1,
    deliveryTime: '20-25 mins',
    cuisine: 'Fried Chicken, American',
    items: [
      {
        id: '4',
        name: 'Original Recipe Chicken',
        price: 199,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop',
        description: 'Secret blend of 11 herbs and spices',
        category: 'Chicken'
      },
      {
        id: '5',
        name: 'Zinger Burger',
        price: 149,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
        description: 'Spicy chicken burger with mayo',
        category: 'Burger'
      },
      {
        id: '6',
        name: 'Hot Wings',
        price: 179,
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&h=200&fit=crop',
        description: 'Spicy chicken wings with signature sauce',
        category: 'Chicken'
      }
    ]
  },
  {
    id: '3',
    name: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    rating: 4.0,
    deliveryTime: '30-35 mins',
    cuisine: 'Pizza, Italian',
    items: [
      {
        id: '7',
        name: 'Supreme Pizza',
        price: 449,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        description: 'Loaded with vegetables and meat',
        category: 'Pizza'
      },
      {
        id: '8',
        name: 'Stuffed Crust Pizza',
        price: 499,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
        description: 'Pizza with cheese-stuffed crust',
        category: 'Pizza'
      }
    ]
  },
  {
    id: '4',
    name: "McDonald's",
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=200&fit=crop',
    rating: 4.3,
    deliveryTime: '15-20 mins',
    cuisine: 'Burgers, Fast Food',
    items: [
      {
        id: '9',
        name: 'Big Mac',
        price: 189,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=200&fit=crop',
        description: 'Two all-beef patties, special sauce',
        category: 'Burger'
      },
      {
        id: '10',
        name: 'Quarter Pounder',
        price: 199,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        description: 'Quarter pound beef patty with cheese',
        category: 'Burger'
      },
      {
        id: '11',
        name: 'McChicken',
        price: 149,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
        description: 'Crispy chicken patty with lettuce',
        category: 'Burger'
      },
      {
        id: '12',
        name: 'French Fries',
        price: 89,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
        description: 'Golden crispy french fries',
        category: 'Sides'
      }
    ]
  },
  {
    id: '5',
    name: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
    rating: 4.2,
    deliveryTime: '20-25 mins',
    cuisine: 'Burgers, Fast Food',
    items: [
      {
        id: '13',
        name: 'Whopper',
        price: 219,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
        description: 'Flame-grilled beef patty with fresh ingredients',
        category: 'Burger'
      },
      {
        id: '14',
        name: 'Chicken Royale',
        price: 199,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        description: 'Crispy chicken fillet with mayo',
        category: 'Burger'
      },
      {
        id: '15',
        name: 'Onion Rings',
        price: 99,
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300&h=200&fit=crop',
        description: 'Crispy golden onion rings',
        category: 'Sides'
      }
    ]
  },
  {
    id: '6',
    name: 'Subway',
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=300&h=200&fit=crop',
    rating: 4.1,
    deliveryTime: '15-20 mins',
    cuisine: 'Sandwiches, Healthy',
    items: [
      {
        id: '16',
        name: 'Italian BMT',
        price: 149,
        image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=300&h=200&fit=crop',
        description: 'Fresh sandwich with Italian meats',
        category: 'Sandwich'
      },
      {
        id: '17',
        name: 'Chicken Teriyaki',
        price: 169,
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&h=200&fit=crop',
        description: 'Grilled chicken with teriyaki sauce',
        category: 'Sandwich'
      },
      {
        id: '18',
        name: 'Veggie Delite',
        price: 119,
        image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300&h=200&fit=crop',
        description: 'Fresh vegetables with choice of sauce',
        category: 'Sandwich'
      }
    ]
  },
  {
    id: '7',
    name: 'Taco Bell',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=300&h=200&fit=crop',
    rating: 4.0,
    deliveryTime: '20-25 mins',
    cuisine: 'Mexican, Tex-Mex',
    items: [
      {
        id: '19',
        name: 'Crunchy Taco',
        price: 89,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=300&h=200&fit=crop',
        description: 'Crispy taco shell with seasoned beef',
        category: 'Mexican'
      },
      {
        id: '20',
        name: 'Burrito Supreme',
        price: 189,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop',
        description: 'Large burrito with beans, rice and meat',
        category: 'Mexican'
      },
      {
        id: '21',
        name: 'Quesadilla',
        price: 149,
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300&h=200&fit=crop',
        description: 'Grilled tortilla with melted cheese',
        category: 'Mexican'
      }
    ]
  },
  {
    id: '8',
    name: 'Golden Dragon Chinese',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop',
    rating: 4.4,
    deliveryTime: '30-35 mins',
    cuisine: 'Chinese, Asian',
    items: [
      {
        id: '22',
        name: '宫保鸡丁 (Kung Pao Chicken)',
        price: 249,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop',
        description: 'Diced chicken with peanuts and chili peppers',
        category: 'Chinese'
      },
      {
        id: '23',
        name: '麻婆豆腐 (Mapo Tofu)',
        price: 189,
        image: 'https://images.unsplash.com/photo-1571197919555-1bd1ac652207?w=300&h=200&fit=crop',
        description: 'Silky tofu in spicy Sichuan sauce',
        category: 'Chinese'
      },
      {
        id: '24',
        name: '炒面 (Chow Mein)',
        price: 219,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
        description: 'Stir-fried noodles with vegetables',
        category: 'Chinese'
      },
      {
        id: '25',
        name: '北京烤鸭 (Peking Duck)',
        price: 399,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        description: 'Traditional roasted duck with pancakes',
        category: 'Chinese'
      },
      {
        id: '26',
        name: '糖醋里脊 (Sweet & Sour Pork)',
        price: 259,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
        description: 'Crispy pork in sweet and sour sauce',
        category: 'Chinese'
      }
    ]
  },
  {
    id: '9',
    name: 'Panda Express',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
    rating: 4.2,
    deliveryTime: '25-30 mins',
    cuisine: 'Chinese, Fast Food',
    items: [
      {
        id: '27',
        name: 'Orange Chicken',
        price: 199,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop',
        description: 'Crispy chicken in sweet orange sauce',
        category: 'Chinese'
      },
      {
        id: '28',
        name: 'Fried Rice',
        price: 149,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
        description: 'Wok-fried rice with eggs and vegetables',
        category: 'Chinese'
      },
      {
        id: '29',
        name: 'Honey Walnut Shrimp',
        price: 279,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        description: 'Crispy shrimp with candied walnuts',
        category: 'Chinese'
      }
    ]
  },
  {
    id: '10',
    name: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
    rating: 4.3,
    deliveryTime: '10-15 mins',
    cuisine: 'Coffee, Beverages',
    items: [
      {
        id: '30',
        name: 'Cappuccino',
        price: 199,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
        description: 'Espresso with steamed milk foam',
        category: 'Beverages'
      },
      {
        id: '31',
        name: 'Frappuccino',
        price: 249,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop',
        description: 'Blended coffee drink with whipped cream',
        category: 'Beverages'
      },
      {
        id: '32',
        name: 'Chocolate Croissant',
        price: 149,
        image: 'https://images.unsplash.com/photo-1549007908-90ae7c39b1ec?w=300&h=200&fit=crop',
        description: 'Buttery croissant with chocolate filling',
        category: 'Desserts'
      }
    ]
  },
  {
    id: '11',
    name: 'Biryani House',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d51b?w=300&h=200&fit=crop',
    rating: 4.5,
    deliveryTime: '35-40 mins',
    cuisine: 'Biryani, Indian',
    items: [
      {
        id: '33',
        name: 'Chicken Biryani',
        price: 249,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d51b?w=300&h=200&fit=crop',
        description: 'Aromatic basmati rice with tender chicken',
        category: 'Biryani'
      },
      {
        id: '34',
        name: 'Mutton Biryani',
        price: 299,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        description: 'Fragrant rice with succulent mutton pieces',
        category: 'Biryani'
      },
      {
        id: '35',
        name: 'Vegetable Biryani',
        price: 199,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
        description: 'Aromatic rice with mixed vegetables',
        category: 'Biryani'
      }
    ]
  },
  {
    id: '12',
    name: 'Five Guys',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    rating: 4.4,
    deliveryTime: '25-30 mins',
    cuisine: 'Burgers, American',
    items: [
      {
        id: '36',
        name: 'Cheeseburger',
        price: 279,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        description: 'Fresh beef patty with American cheese',
        category: 'Burger'
      },
      {
        id: '37',
        name: 'Five Guys Fries',
        price: 149,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
        description: 'Hand-cut fries cooked in peanut oil',
        category: 'Sides'
      }
    ]
  }
];

export function HomeScreen({ user, cartItemCount, onSelectRestaurant, onNavigateToCart, onNavigateToProfile }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToProfile}
              className="p-0"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Button>
            <div>
              <p className="text-sm text-gray-600">Hello,</p>
              <p className="font-semibold">{user?.name || 'User'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToCart}
            className="relative"
          >
            🛒
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm">📍</span>
          <span className="text-sm text-gray-600">Delivering to</span>
          <span className="text-sm font-semibold">Home - Mumbai</span>
        </div>

        {/* Search */}
        <Input
          placeholder="Search for restaurants, cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-4">
          <h2 className="font-semibold mb-3">What's on your mind?</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedCategory === category.name ? 'bg-orange-100' : category.color
                }`}
              >
                <span className="text-2xl mb-1">{category.emoji}</span>
                <span className="text-xs text-center">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Popular Restaurants'}
            </h2>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-orange-500"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {filteredRestaurants.map((restaurant) => (
              <Button
                key={restaurant.id}
                variant="ghost"
                onClick={() => onSelectRestaurant(restaurant)}
                className="w-full p-0 h-auto hover:bg-gray-50"
              >
                <div className="bg-white rounded-xl p-3 shadow-sm w-full">
                  <div className="flex space-x-3">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          ⭐ {restaurant.rating}
                        </span>
                        <span className="text-xs text-gray-600">
                          🕒 {restaurant.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}