import dbConnect from '../../utils/dbConnect';
import ChatMessage from '../../models/ChatMessage';
import { authenticate } from '../../utils/auth';

export default async function handler(req, res) {
  await dbConnect();
  const user = await authenticate(req, res);
  if (!user) return;

  const { roomId } = req.query;

  if (req.method === 'GET') {
    try {
      const messages = await ChatMessage.find({ chatRoom: roomId })
        .sort({ createdAt: 1 })
        .populate('sender', 'name email');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 