import dbConnect from '../../utils/dbConnect';
import SupportTicket from '../../models/SupportTicket';
import { authenticate } from '../../utils/auth';

export default async function handler(req, res) {
  await dbConnect();
  const user = await authenticate(req, res);
  if (!user) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ticket = await SupportTicket.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      if (ticket.userId.toString() !== user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    // Add message to ticket
    try {
      const ticket = await SupportTicket.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      ticket.messages.push({
        sender: user.id,
        content: req.body.content,
        timestamp: new Date()
      });
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 