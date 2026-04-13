const router = require('express').Router();
const Order = require('../models/order');
const authMiddleware = require('../middleware/authMiddleware');

// create order
router.post('/', async (req, res) => {
  try {
    const { name, address, quantity, totalPrice, userId } = req.body;
    const orderData = { name, address, quantity, totalPrice };
    if (userId) orderData.userId = userId;
    
    const order = await Order.create(orderData);
    console.log("Order saved:", order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get orders (for admin/all)
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// get my orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;