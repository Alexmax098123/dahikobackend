const Review = require('../models/review');

// Add review
exports.addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};