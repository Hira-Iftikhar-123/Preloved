import dbConnect from '../utils/dbConnect';
import Order from '../models/Orders';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    const { type } = req.body;
    if (type === 'orderData') {
      let data = req.body.order_data;
      data.splice(0, 0, { Order_Date: req.body.order_date });
      let eId = await Order.findOne({ email: req.body.email });
      if (eId === null) {
        try {
          await Order.create({ email: req.body.email, order_data: [data] });
          res.json({ success: true });
        } catch (error) {
          console.log(error.message);
          res.status(500).json({ error: 'Server Error', message: error.message });
        }
      } else {
        try {
          await Order.findOneAndUpdate(
            { email: req.body.email },
            { $push: { order_data: data } }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: 'Server Error', message: error.message });
        }
      }
    } else if (type === 'myorderData') {
      try {
        let myData = await Order.findOne({ email: req.body.email });
        res.json({ orderData: myData || { order_data: [] } });
      } catch (error) {
        res.status(500).json({ error: 'Server Error', message: error.message });
      }
    } else {
      res.status(400).json({ error: 'Invalid type' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
