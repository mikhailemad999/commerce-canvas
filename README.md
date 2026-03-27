🛒 Amazon-like E-commerce Platform (Fullstack)

🚀 Overview

This is a production-ready Amazon-style e-commerce application built with:

Next.js (React)

Tailwind CSS

Node.js + Express

MongoDB + Mongoose

JWT Authentication

Stripe Payments

Cloudinary Image Upload



---

📁 Project Structure

root/
 ├── client/
 │   ├── components/
 │   ├── pages/
 │   ├── redux/
 │   ├── utils/
 │   └── styles/
 │
 ├── server/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   └── config/
 │
 ├── .env
 ├── package.json
 └── README.md


---

⚙️ Backend Setup (Step by Step)

1. Initialize Server

mkdir server && cd server
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors express-validator multer cloudinary stripe


---

2. server.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.listen(5000, () => console.log('Server running'));


---

3. User Model

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


---

4. Auth Controller

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json('User not found');

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json('Invalid password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json(err.message);
  }
};


---

5. Product Model

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  category: String,
  brand: String,
  stock: Number,
  ratings: Number,
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);


---

6. Product Controller (CRUD)

const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


---

🎨 Frontend Setup (Next.js)

npx create-next-app@latest client
cd client
npm install axios react-redux @reduxjs/toolkit tailwindcss


---

Tailwind Setup

npx tailwindcss init -p

tailwind.config.js

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};


---

Example Product Card Component

export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded">
      <img src={product.images[0]} />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
}


---

🔗 API Integration

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getProducts = () => API.get('/products');


---

💳 Stripe Integration

const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.payment = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel'
  });

  res.json({ id: session.id });
};


---

☁️ Deployment

Backend

Deploy on Render / Railway


Frontend

Deploy on Vercel


Database

MongoDB Atlas



---

🔥 Extra Features

Wishlist

Reviews system

Dark Mode

Email Notifications



---

📌 Notes

This is a scalable architecture. You can extend it with:

Microservices

Docker

CI/CD



---

🧑‍💻 Author

Senior Fullstack Implementation by ChatGPT
