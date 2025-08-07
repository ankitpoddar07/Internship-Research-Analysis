// Hono.js server entry point
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

// Create Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to verify user token
const verifyUser = async (accessToken: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      throw new Error('Invalid token');
    }
    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

// Create order endpoint
app.post('/make-server-9850631d/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    const { items, total, delivery_address } = await c.req.json();

    if (!items || !total || !delivery_address) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orderData = {
      id: orderId,
      user_id: user.id,
      items,
      total,
      status: 'preparing',
      delivery_address,
      created_at: new Date().toISOString()
    };

    // Store order in KV store
    await kv.set(`order:${orderId}`, orderData);
    
    // Add to user's orders list
    const userOrdersKey = `user_orders:${user.id}`;
    const existingOrders = await kv.get(userOrdersKey) || [];
    await kv.set(userOrdersKey, [orderId, ...existingOrders]);

    return c.json({ order: orderData });

  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get user orders endpoint
app.get('/make-server-9850631d/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    // Get user's order IDs
    const userOrdersKey = `user_orders:${user.id}`;
    const orderIds = await kv.get(userOrdersKey) || [];

    // Get order details
    const orders = [];
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }

    return c.json({ orders });

  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Update order status endpoint
app.patch('/make-server-9850631d/orders/:orderId/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();

    if (!status) {
      return c.json({ error: 'Status required' }, 400);
    }

    // Get existing order
    const existingOrder = await kv.get(`order:${orderId}`);
    if (!existingOrder) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Verify order belongs to user (or allow for system updates)
    if (existingOrder.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Update order status
    const updatedOrder = { ...existingOrder, status };
    await kv.set(`order:${orderId}`, updatedOrder);

    return c.json({ order: updatedOrder });

  } catch (error) {
    console.log('Error updating order status:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get order by ID endpoint
app.get('/make-server-9850631d/orders/:orderId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    const orderId = c.req.param('orderId');
    const order = await kv.get(`order:${orderId}`);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Verify order belongs to user
    if (order.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    return c.json({ order });

  } catch (error) {
    console.log('Error fetching order:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Store user profile endpoint (optional - for additional profile data)
app.post('/make-server-9850631d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    const { name, phone, address } = await c.req.json();

    const profileData = {
      user_id: user.id,
      name,
      phone,
      address,
      updated_at: new Date().toISOString()
    };

    // Store profile in KV store
    await kv.set(`profile:${user.id}`, profileData);

    return c.json({ profile: profileData });

  } catch (error) {
    console.log('Error storing profile:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get user profile endpoint
app.get('/make-server-9850631d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const user = await verifyUser(accessToken);

    const profile = await kv.get(`profile:${user.id}`);

    return c.json({ 
      profile: profile || {
        user_id: user.id,
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        address: ''
      }
    });

  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Health check endpoint
app.get('/make-server-9850631d/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);