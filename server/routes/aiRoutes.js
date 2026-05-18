const express = require('express');
const router = express.Router();
const { generateRecommendation, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, generateRecommendation);
router.post('/chat', protect, chatWithAI);

module.exports = router;
