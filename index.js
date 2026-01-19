const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from Node API");
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const MONGO_ENDPOINT = process.env.MONGO;
const URL_LINK = process.env.URL;
const PORT_ADDR = process.env.PORT || 3000;

mongoose.connect(MONGO_ENDPOINT)
    .then(() => {
        console.log("Connected to the database");
        app.listen(PORT_ADDR, () => {
            console.log(`Server is running on port ${PORT_ADDR}`);
        });
    })
    .catch((err) => {
        console.log("Connection to the database failed");
        console.error(err);
    });
