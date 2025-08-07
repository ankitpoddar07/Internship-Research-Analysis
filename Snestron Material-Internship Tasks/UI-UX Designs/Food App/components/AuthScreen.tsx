// Login/Signup screen component
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';

interface AuthScreenProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<User>;
  onSignUp: (userData: { name: string; email: string; phone: string; password: string }) => Promise<User>;
}

export function AuthScreen({ onLogin, onSignUp }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      if (isSignUp && (!formData.name || !formData.phone)) {
        throw new Error('Please fill in all required fields');
      }

      if (isSignUp) {
        await onSignUp({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      } else {
        await onLogin({
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to create demo user account
      try {
        await onSignUp({
          name: 'Demo User',
          email: 'demo@foodease.com',
          phone: '9876543210',
          password: 'demo123456'
        });
      } catch (signupError: any) {
        // If signup fails (user might already exist), try to sign in
        console.log('Demo signup failed, trying signin:', signupError.message);
        await onLogin({
          email: 'demo@foodease.com',
          password: 'demo123456'
        });
      }
    } catch (error: any) {
      console.error('Demo auth error:', error);
      setError('Demo login failed. Please try creating your own account.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@foodease.com',
      phone: '9876543210',
      password: 'demo123456'
    });
    setError(null);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-white">
        <h1 className="text-2xl font-bold text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-center opacity-90 mt-2">
          {isSignUp ? 'Join FoodEase today' : 'Sign in to continue'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-12"
              disabled={loading}
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-12"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl mt-6"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setFormData({ name: '', email: '', phone: '', password: '' });
            }}
            className="text-orange-500 font-semibold"
            disabled={loading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>

        {/* Demo options */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center mb-3">
              <strong>Try the demo:</strong>
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Quick Demo Login'}
              </Button>
              <Button
                onClick={fillDemoCredentials}
                variant="ghost"
                className="w-full text-gray-600 text-sm"
                disabled={loading}
              >
                Fill Demo Credentials
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Demo credentials: demo@foodease.com / demo123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}