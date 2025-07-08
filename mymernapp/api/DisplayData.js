import dbConnect from '../utils/dbConnect';
import Dress from '../models/Dress';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const dresses = await Dress.find();
      const categories = global.clothingCategories || [];
      res.status(200).json([dresses, categories]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error while fetching dress data.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}