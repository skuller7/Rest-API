const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js');
const productRoute = require("./routes/product.route.js")
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/api/products", productRoute);
app.get('/', (req, res) => {
    res.send("Hello from Node API");
});

// app.get('/api/products', async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.status(200).json(products)
//     } catch (error) {
//         res.status(500).json({ message: error.message})
//     }
// });

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        res.status(200).json({message:"Product deleted successfully"})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

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
