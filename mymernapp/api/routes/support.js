const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const ChatMessage = require('../models/ChatMessage');
const authMiddleware = require('../middleware/auth');

router.post('/tickets', authMiddleware, async (req, res) => {
    try {
        console.log('Creating support ticket for user:', req.user.id);
        const ticket = new SupportTicket({
            userId: req.user.id,
            subject: req.body.subject,
            description: req.body.description,
            category: req.body.category,
            priority: req.body.priority
        });
        await ticket.save();
        console.log('Ticket created:', ticket._id);

        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/tickets', authMiddleware, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/tickets/:id', authMiddleware, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/tickets/:id/messages', authMiddleware, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({
            sender: req.user.id,
            content: req.body.content,
            timestamp: new Date()
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/chat/:roomId', authMiddleware, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ chatRoom: req.params.roomId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name email');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/chat', authMiddleware, async (req, res) => {
    try {
        const message = new ChatMessage({
            sender: req.user.id,
            receiver: req.body.receiverId,
            content: req.body.content,
            chatRoom: req.body.chatRoom
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 