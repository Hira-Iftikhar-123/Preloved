const express = require('express');
const router = express.Router();
const adminAuth = require('../utils/middleware/adminAuth');
const Dress = require('../utils/models/Dress');
const User = require('../utils/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const SupportTicket = require('../utils/models/SupportTicket');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      console.log('User found:', user);
      if (!user || !user.isAdmin) {
        console.log('User not found or not admin');
        return res.status(401).json({ error: 'Invalid credentials or not an admin' });
      }
      console.log('Password from request:', password);
      console.log('Password hash from DB:', user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
});
  
// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../../public/uploads/dresses');
        console.log('Multer destination:', dest); // Debug log
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});

// Get all dresses (admin view)
router.get('/dresses', adminAuth, async (req, res) => {
    try {
        const dresses = await Dress.find().sort({ createdAt: -1 });
        res.json(dresses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dresses' });
    }
});

// Add new dress
router.post('/dresses', adminAuth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, brand, description, category, sizes } = req.body;
        const images = req.files.map(file => `/uploads/dresses/${file.filename}`);

        const dress = new Dress({
            name,
            brand,
            description,
            category,
            images,
            sizes: JSON.parse(sizes),
            createdBy: req.user.id
        });

        await dress.save();
        res.status(201).json(dress);
    } catch (error) {
        res.status(500).json({ error: 'Error creating dress' });
    }
});

// Update dress
router.put('/dresses/:id', adminAuth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, brand, description, category, sizes, isAvailable } = req.body;
        const updateData = {
            name,
            brand,
            description,
            category,
            sizes: JSON.parse(sizes),
            isAvailable: JSON.parse(isAvailable)
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/dresses/${file.filename}`);
        }

        const dress = await Dress.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!dress) {
            return res.status(404).json({ error: 'Dress not found' });
        }

        res.json(dress);
    } catch (error) {
        res.status(500).json({ error: 'Error updating dress' });
    }
});

// Delete dress
router.delete('/dresses/:id', adminAuth, async (req, res) => {
    try {
        const dress = await Dress.findByIdAndDelete(req.params.id);
        
        if (!dress) {
            return res.status(404).json({ error: 'Dress not found' });
        }

        res.json({ message: 'Dress deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting dress' });
    }
});

// Get single dress details
router.get('/dresses/:id', adminAuth, async (req, res) => {
    try {
        const dress = await Dress.findById(req.params.id);
        
        if (!dress) {
            return res.status(404).json({ error: 'Dress not found' });
        }

        res.json(dress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dress details' });
    }
});

// Get all support tickets with user info
router.get('/support/tickets', adminAuth, async (req, res) => {
    try {
        console.log('Admin requesting support tickets');
        const tickets = await SupportTicket.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        console.log('Found tickets:', tickets.length);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching admin tickets:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get a specific support ticket with user info
router.get('/support/tickets/:id', adminAuth, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('userId', 'name email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin reply to a ticket
router.post('/support/tickets/:id/messages', adminAuth, async (req, res) => {
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
        
        // Populate user data before sending response
        const populatedTicket = await SupportTicket.findById(ticket._id)
            .populate('userId', 'name email');
        res.status(201).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

module.exports = router; 