const express = require('express');
const { getJobs, getJobById } = require('../controllers/jobController');
const router = express.Router();

router.get('/', getJobs);       // Fetch all jobs
router.get('/:id', getJobById); // Fetch single job by ID

module.exports = router;