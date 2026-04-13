

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (IMPORTANT)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("DB Error:", err));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Routes
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);


// Test route
app.get('/', (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});