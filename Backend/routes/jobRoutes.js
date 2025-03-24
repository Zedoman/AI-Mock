const express = require('express');
const { getJobs, getJobById, createJob, autoGenerateJob } = require('../controllers/jobController');
const { validateJobRequest } = require('../middleware/validateRequest');
const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', validateJobRequest, createJob);
router.post('/auto', autoGenerateJob); // New endpoint for auto-generation

module.exports = router;