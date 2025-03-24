const Job = require('../models/Job');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

const startMockInterview = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return sendErrorResponse(res, 404, 'Job not found');
    const { codingQuestion } = job;
    sendSuccessResponse(res, 200, 'Mock interview started', { codingQuestion });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error starting mock interview', error.message);
  }
};

module.exports = { startMockInterview };