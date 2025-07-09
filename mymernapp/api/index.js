export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'Preloved API is running!',
      status: 'active',
      endpoints: [
        '/api/createuser',
        '/api/displaydata', 
        '/api/orderdata',
        '/api/recommendationdata',
        '/api/dressdata',
        '/api/support/tickets',
        '/api/support/ticket',
        '/api/support/chat',
        '/api/support/chatRoom'
      ]
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}