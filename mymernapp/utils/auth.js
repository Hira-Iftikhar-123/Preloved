import jwt from 'jsonwebtoken';

export async function authenticate(req, res) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return null;
  }
} 