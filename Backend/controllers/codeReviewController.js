const UserAttempt = require('../models/UserAttempt');
const { compileCode } = require('../services/compilerService');
const { reviewCodeWithAI } = require('../services/aiReviewService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

const submitCode = async (req, res) => {
    const { userId, jobId, code, language } = req.body;
  
    try {
      const compilationResult = await compileCode(code, language, jobId);
      if (!compilationResult.success) {
        return sendErrorResponse(res, 400, 'Code compilation failed', compilationResult.error);
      }
  
      const aiFeedback = await reviewCodeWithAI(code, language);
      const attempt = new UserAttempt({ userId, jobId, code, language, feedback: aiFeedback });
      await attempt.save();
  
      sendSuccessResponse(res, 200, 'Code submitted successfully', {
        compilationResult,
        aiFeedback,
      });
    } catch (error) {
      sendErrorResponse(res, 500, 'Error submitting code', error.message);
    }
  };

module.exports = { submitCode };