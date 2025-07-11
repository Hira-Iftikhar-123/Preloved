import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    await client.connect();
    const db = client.db('Preloved');

    const { action } = req.query;

    switch (action) {
      case 'getDresses':
        return await getDresses(req, res, db);
      case 'getDressById':
        return await getDressById(req, res, db);
      case 'createDress':
        return await createDress(req, res, db);
      case 'updateDress':
        return await updateDress(req, res, db);
      case 'deleteDress':
        return await deleteDress(req, res, db);
      case 'getOrders':
        return await getOrders(req, res, db);
      case 'createOrder':
        return await createOrder(req, res, db);
      case 'updateOrder':
        return await updateOrder(req, res, db);
      case 'getRecommendations':
        return await getRecommendations(req, res, db);
      case 'createRecommendation':
        return await createRecommendation(req, res, db);
      case 'getUsers':
        return await getUsers(req, res, db);
      case 'getUserById':
        return await getUserById(req, res, db);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Data API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}

// Dress functions
async function getDresses(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dresses = await db.collection('dresses').find({}).toArray();
    return res.status(200).json(dresses);
  } catch (error) {
    console.error('Get dresses error:', error);
    return res.status(500).json({ error: 'Failed to fetch dresses' });
  }
}

async function getDressById(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Dress ID is required' });
  }

  try {
    const dress = await db.collection('dresses').findOne({ _id: new ObjectId(id) });
    
    if (!dress) {
      return res.status(404).json({ error: 'Dress not found' });
    }

    return res.status(200).json(dress);
  } catch (error) {
    console.error('Get dress by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch dress' });
  }
}

async function createDress(req, res, db) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, price, description, images, category, size, condition } = req.body;

  if (!name || !price || !description || !images) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const dress = {
      name,
      price: parseFloat(price),
      description,
      images,
      category: category || 'general',
      size: size || 'M',
      condition: condition || 'good',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('dresses').insertOne(dress);
    return res.status(201).json({ 
      message: 'Dress created successfully', 
      dressId: result.insertedId 
    });
  } catch (error) {
    console.error('Create dress error:', error);
    return res.status(500).json({ error: 'Failed to create dress' });
  }
}

async function updateDress(req, res, db) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Dress ID is required' });
  }

  try {
    updateData.updatedAt = new Date();

    const result = await db.collection('dresses').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Dress not found' });
    }

    return res.status(200).json({ message: 'Dress updated successfully' });
  } catch (error) {
    console.error('Update dress error:', error);
    return res.status(500).json({ error: 'Failed to update dress' });
  }
}

async function deleteDress(req, res, db) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Dress ID is required' });
  }

  try {
    const result = await db.collection('dresses').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Dress not found' });
    }

    return res.status(200).json({ message: 'Dress deleted successfully' });
  } catch (error) {
    console.error('Delete dress error:', error);
    return res.status(500).json({ error: 'Failed to delete dress' });
  }
}

// Order functions
async function getOrders(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  try {
    let query = {};
    
    if (userId) {
      query.userId = new ObjectId(userId);
    }

    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function createOrder(req, res, db) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, items, totalAmount, shippingAddress } = req.body;

  if (!userId || !items || !totalAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = {
      userId: new ObjectId(userId),
      items: items.map(item => ({
        ...item,
        dressId: new ObjectId(item.dressId)
      })),
      totalAmount: parseFloat(totalAmount),
      shippingAddress: shippingAddress || {},
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    return res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: result.insertedId 
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}

async function updateOrder(req, res, db) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: 'Order ID and status are required' });
  }

  try {
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ error: 'Failed to update order' });
  }
}

// Recommendation functions
async function getRecommendations(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  try {
    let query = {};
    
    if (userId) {
      query.userId = new ObjectId(userId);
    }

    const recommendations = await db.collection('recommendations')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}

async function createRecommendation(req, res, db) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, dressIds } = req.body;

  if (!userId || !dressIds || !Array.isArray(dressIds)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const recommendation = {
      userId: new ObjectId(userId),
      dressIds: dressIds.map(id => new ObjectId(id)),
      createdAt: new Date()
    };

    const result = await db.collection('recommendations').insertOne(recommendation);
    return res.status(201).json({ 
      message: 'Recommendation created successfully', 
      recommendationId: result.insertedId 
    });
  } catch (error) {
    console.error('Create recommendation error:', error);
    return res.status(500).json({ error: 'Failed to create recommendation' });
  }
}

// User functions
async function getUsers(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const users = await db.collection('users')
      .find({})
      .project({ password: 0 }) // Exclude password
      .toArray();

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUserById(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await db.collection('users')
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
} 