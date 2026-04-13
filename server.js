

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (Improved for Render)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Stop trying after 5 seconds instead of hanging
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => {
  console.log("❌ DB CONNECTION ERROR:", err.message);
  if (err.message.includes("whitelist")) {
    console.log("👉 Reminder: Add Render's IP to MongoDB Atlas Whitelist.");
  }
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});