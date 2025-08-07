// User profile and settings page
import React from 'react';
import { Button } from './ui/button';
import { User } from '../App';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onNavigateToHistory: () => void;
  onNavigateToDatabase: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ user, onBack, onNavigateToHistory, onNavigateToDatabase, onLogout }: ProfileScreenProps) {
  const menuItems = [
    { id: 'orders', label: 'Order History', icon: '📋', action: onNavigateToHistory },
    { id: 'database', label: 'Database & Project Info', icon: '🗄️', action: onNavigateToDatabase },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍', action: () => {} },
    { id: 'payments', label: 'Payment Methods', icon: '💳', action: () => {} },
    { id: 'favorites', label: 'Favorite Restaurants', icon: '❤️', action: () => {} },
    { id: 'help', label: 'Help & Support', icon: '🆘', action: () => {} },
    { id: 'settings', label: 'Settings', icon: '⚙️', action: () => {} }
  ];

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
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="opacity-90">{user.email}</p>
            <p className="opacity-90">{user.phone}</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">12</div>
            <div className="text-xs opacity-90">Orders</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">₹2,450</div>
            <div className="text-xs opacity-90">Saved</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">4.8</div>
            <div className="text-xs opacity-90">Rating</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={item.action}
              className={`w-full justify-start h-14 px-4 hover:bg-gray-50 ${
                item.id === 'database' ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <span>{item.label}</span>
                  {item.id === 'database' && (
                    <div className="text-xs text-blue-600">View Supabase data & download project</div>
                  )}
                </div>
              </div>
              <span className="ml-auto">→</span>
            </Button>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold mb-2">About FoodEase</h3>
          <p className="text-sm text-gray-600 mb-2">Version 1.0.0 - Complete Edition</p>
          <div className="text-xs text-gray-500 mb-2">
            ✅ Chinese Cuisine • ✅ Famous Brands • ✅ WiFi Monitor • ✅ Full Backend
          </div>
          <div className="flex space-x-4 text-sm">
            <Button variant="ghost" size="sm" className="p-0 text-orange-500">
              Terms of Service
            </Button>
            <Button variant="ghost" size="sm" className="p-0 text-orange-500">
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full py-3 rounded-xl border-red-500 text-red-500 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}