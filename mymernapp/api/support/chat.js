import dbConnect from '../../utils/dbConnect';
import ChatMessage from '../../models/ChatMessage';
import { authenticate } from '../../utils/auth';

export default async function handler(req, res) {
  await dbConnect();
  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method === 'POST') {
    try {
      const message = new ChatMessage({
        sender: user.id,
        receiver: req.body.receiverId,
        content: req.body.content,
        chatRoom: req.body.chatRoom
      });
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 