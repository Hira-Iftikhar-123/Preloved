import dbConnect from '../utils/dbConnect';
import Dress from '../models/Dress';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const dresses = await Dress.find({ isAvailable: true }).sort({ createdAt: -1 });
      res.status(200).json(dresses);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dresses' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 