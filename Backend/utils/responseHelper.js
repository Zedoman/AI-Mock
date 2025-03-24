const sendSuccessResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({ success: true, message, data });
  };
  
  const sendErrorResponse = (res, statusCode, message, error = null) => {
    res.status(statusCode).json({ success: false, message, error });
  };
  
  module.exports = { sendSuccessResponse, sendErrorResponse };