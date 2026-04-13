const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  address: String,
  quantity: Number,
  totalPrice: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);