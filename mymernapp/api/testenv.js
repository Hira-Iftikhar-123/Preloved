export default function handler(req, res) {
    res.status(200).json({ MONGODB_URI: process.env.MONGODB_URI || "NOT SET" });
}