// Welcome screen component
import React from 'react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="h-full bg-gradient-to-br from-orange-400 to-red-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="text-2xl">🍽️</div>
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">FoodEase</h1>
          <p className="text-xl opacity-90">Delicious food, delivered fast</p>
        </div>
        
        {/* Features */}
        <div className="space-y-4 text-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <span className="text-lg">Fast delivery in 30 mins</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">🏆</span>
            </div>
            <span className="text-lg">Top rated restaurants</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <span className="text-lg">Best prices guaranteed</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full bg-white text-orange-500 hover:bg-gray-50 text-lg py-6 rounded-2xl font-semibold shadow-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}