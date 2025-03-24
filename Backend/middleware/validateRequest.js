const validateJobRequest = (req, res, next) => {
    const { title, description, codingQuestion } = req.body;
  
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ success: false, message: 'Title is required and must be a string' });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ success: false, message: 'Description is required and must be a string' });
    }
    if (!codingQuestion || !codingQuestion.title || !codingQuestion.description || !codingQuestion.difficulty) {
      return res.status(400).json({ success: false, message: 'Coding question must include title, description, and difficulty' });
    }
    if (!['Easy', 'Medium', 'Hard'].includes(codingQuestion.difficulty)) {
      return res.status(400).json({ success: false, message: 'Difficulty must be Easy, Medium, or Hard' });
    }
  
    next();
  };
  
  module.exports = { validateJobRequest };