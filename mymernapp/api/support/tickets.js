import dbConnect from '../../utils/dbConnect';
import SupportTicket from '../../models/SupportTicket';
import { authenticate } from '../../utils/auth';

export default async function handler(req, res) {
  await dbConnect();
  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method === 'POST') {
    try {
      const ticket = new SupportTicket({
        userId: user.id,
        subject: req.body.subject,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority
      });
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const tickets = await SupportTicket.find({ userId: user.id }).sort({ createdAt: -1 });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 