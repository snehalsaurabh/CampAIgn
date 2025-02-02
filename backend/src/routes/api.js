const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.handleChat);
router.post('/campaign', chatController.createCampaign);

module.exports = router;