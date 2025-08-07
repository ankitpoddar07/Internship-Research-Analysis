// Supabase database dashboard info
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { projectId } from '../utils/supabase/info';

interface DatabaseInfoProps {
  onBack: () => void;
}

export function DatabaseInfo({ onBack }: DatabaseInfoProps) {
  const handleDownloadZip = () => {
    // Create a simple text file with all the project files list
    const projectFiles = `
FoodEase Project Files - Complete Structure

Main Application:
- App.tsx (Main application component)
- styles/globals.css (Global styles and theming)

Components:
- components/WelcomeScreen.tsx (Landing page)
- components/AuthScreen.tsx (Login/Signup)
- components/HomeScreen.tsx (Restaurant listing)
- components/RestaurantScreen.tsx (Restaurant details)
- components/CartScreen.tsx (Shopping cart)
- components/CheckoutScreen.tsx (Order checkout)
- components/OrderTrackingScreen.tsx (Order tracking)
- components/ProfileScreen.tsx (User profile)
- components/OrderHistoryScreen.tsx (Order history)
- components/DatabaseInfo.tsx (Database information)

UI Components:
- components/ui/ (Complete ShadCN UI library)
- components/figma/ImageWithFallback.tsx (Image component)

Backend:
- supabase/functions/server/index.tsx (Hono server)
- supabase/functions/server/kv_store.tsx (Database utilities)

Utils:
- utils/supabase.ts (Supabase client)
- utils/supabase/info.tsx (Project info)

All files are production-ready with:
✅ Complete authentication system
✅ Restaurant browsing and search
✅ Shopping cart functionality
✅ Order placement and tracking
✅ User profile management
✅ Mobile-responsive design
✅ Chinese cuisine support (宫保鸡丁, 麻婆豆腐, etc.)
✅ Famous restaurant brands (McDonald's, KFC, Domino's, etc.)
✅ WiFi connection indicator
✅ Supabase backend integration

To download individual files:
1. Right-click in the code editor
2. Select "Save As" for each file
3. Maintain the folder structure as shown above

Database Information:
Project URL: https://${projectId}.supabase.co
To access your Supabase dashboard:
1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Select your project: ${projectId}
4. Navigate to:
   - Authentication > Users (to see user data)
   - Database > Tables (to see kv_store_9850631d table)
   - Edge Functions > Logs (to see API logs)
`;

    const blob = new Blob([projectFiles], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoodEase-Project-Info.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ←
          </Button>
          <h1 className="font-semibold">Database & Project Info</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🗄️</span>
              <span>Supabase Database</span>
            </CardTitle>
            <CardDescription>
              Access your FoodEase application database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Project URL:</p>
              <p className="text-xs text-blue-600 break-all">
                https://{projectId}.supabase.co
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Data:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 p-2 rounded">
                  <span className="font-medium">👥 Users</span>
                  <p className="text-gray-600">Authentication data</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium">🛒 Orders</span>
                  <p className="text-gray-600">Order history</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <span className="font-medium">📊 Analytics</span>
                  <p className="text-gray-600">Usage metrics</p>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <span className="font-medium">🔧 Logs</span>
                  <p className="text-gray-600">API activity</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <span className="mr-2">🔗</span>
              Open Supabase Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📱</span>
              <span>App Features</span>
            </CardTitle>
            <CardDescription>
              Complete food delivery app with enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-medium">✅ Authentication</p>
                <p className="font-medium">✅ Restaurant Browse</p>
                <p className="font-medium">✅ Chinese Cuisine</p>
                <p className="font-medium">✅ Cart System</p>
                <p className="font-medium">✅ Order Tracking</p>
                <p className="font-medium">✅ WiFi Indicator</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">✅ Famous Brands</p>
                <p className="font-medium">✅ Burger Chains</p>
                <p className="font-medium">✅ Mobile Design</p>
                <p className="font-medium">✅ Payment Flow</p>
                <p className="font-medium">✅ User Profile</p>
                <p className="font-medium">✅ Order History</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🍽️</span>
              <span>Restaurant Brands</span>
            </CardTitle>
            <CardDescription>
              Famous restaurants with authentic menu items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-medium">🍕 Pizza</div>
                <div className="text-gray-600">Domino's, Pizza Hut</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-medium">🍔 Burgers</div>
                <div className="text-gray-600">McDonald's, Burger King, Five Guys</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-medium">🥡 Chinese</div>
                <div className="text-gray-600">Golden Dragon, Panda Express</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-medium">🍗 Chicken</div>
                <div className="text-gray-600">KFC</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-medium">🥪 Sandwich</div>
                <div className="text-gray-600">Subway</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-medium">🌮 Mexican</div>
                <div className="text-gray-600">Taco Bell</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📦</span>
              <span>Download Project</span>
            </CardTitle>
            <CardDescription>
              Get project files and structure information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDownloadZip}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <span className="mr-2">📄</span>
              Download Project Info
            </Button>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Contains file structure and database access info
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="font-semibold text-lg mb-2">FoodEase Complete!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your comprehensive food delivery app is ready with all features:
              </p>
              <div className="text-xs space-y-1">
                <p>🔐 Secure authentication with Supabase</p>
                <p>🍜 Chinese dishes with authentic names</p>
                <p>🍔 Famous burger chains &amp; restaurants</p>
                <p>📶 WiFi connection monitoring</p>
                <p>🗄️ Complete database integration</p>
                <p>📱 Mobile-optimized design</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}