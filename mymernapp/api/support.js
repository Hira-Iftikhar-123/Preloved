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
    const db = client.db('preloved');

    const { action } = req.query;

    switch (action) {
      case 'createTicket':
        return await createTicket(req, res, db);
      case 'getTickets':
        return await getTickets(req, res, db);
      case 'updateTicket':
        return await updateTicket(req, res, db);
      case 'sendMessage':
        return await sendMessage(req, res, db);
      case 'getMessages':
        return await getMessages(req, res, db);
      case 'getChatRooms':
        return await getChatRooms(req, res, db);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Support API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}

// Ticket functions
async function createTicket(req, res, db) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, subject, description, priority } = req.body;

  if (!userId || !subject || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const ticket = {
      userId: new ObjectId(userId),
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('supportTickets').insertOne(ticket);
    return res.status(201).json({ 
      message: 'Ticket created successfully', 
      ticketId: result.insertedId 
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}

async function getTickets(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, isAdmin } = req.query;

  try {
    let query = {};
    
    if (!isAdmin || isAdmin === 'false') {
      query.userId = new ObjectId(userId);
    }

    const tickets = await db.collection('supportTickets')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

async function updateTicket(req, res, db) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticketId, status, adminResponse } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  try {
    const updateData = {
      updatedAt: new Date()
    };

    if (status) updateData.status = status;
    if (adminResponse) updateData.adminResponse = adminResponse;

    const result = await db.collection('supportTickets').updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Update ticket error:', error);
    return res.status(500).json({ error: 'Failed to update ticket' });
  }
}

// Chat functions
async function sendMessage(req, res, db) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticketId, senderId, message, senderType } = req.body;

  if (!ticketId || !senderId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const chatMessage = {
      ticketId: new ObjectId(ticketId),
      senderId: new ObjectId(senderId),
      message,
      senderType: senderType || 'user',
      timestamp: new Date()
    };

    const result = await db.collection('chatMessages').insertOne(chatMessage);
    return res.status(201).json({ 
      message: 'Message sent successfully', 
      messageId: result.insertedId 
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

async function getMessages(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticketId } = req.query;

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  try {
    const messages = await db.collection('chatMessages')
      .find({ ticketId: new ObjectId(ticketId) })
      .sort({ timestamp: 1 })
      .toArray();

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function getChatRooms(req, res, db) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, isAdmin } = req.query;

  try {
    let query = {};
    
    if (!isAdmin || isAdmin === 'false') {
      query.userId = new ObjectId(userId);
    }

    const tickets = await db.collection('supportTickets')
      .find(query)
      .project({ _id: 1, subject: 1, status: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    return res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
} 