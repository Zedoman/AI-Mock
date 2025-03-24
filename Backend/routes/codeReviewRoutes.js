const express = require('express');
const { submitCode } = require('../controllers/codeReviewController');
const router = express.Router();

router.post('/submit', submitCode); // Submit code for review

module.exports = router;