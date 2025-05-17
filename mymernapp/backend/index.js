const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.port;
const mongoDB = require('./db')

mongoDB();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get('/',(req,res) => {
    res.send('Hello from Backend')
})

app.use(express.json());

app.use('/api',require("./routes/CreateUser"));
app.use('/api',require('./routes/DisplayData'));
app.use('/api',require('./routes/OrderData'));
app.use('/api',require('./routes/RecommendationData'));

app.listen(port, () => {
    console.log(`Server running on http://localhost: ${port}`)
})