const Job = require('../models/Job');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');
const { generateCodingQuestion } = require('../services/aiReviewService');

const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 9; // Default to 9 jobs per page
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments();
    const jobs = await Job.find().skip(skip).limit(limit);

    res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        jobsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return sendErrorResponse(res, 404, 'Job not found');
    sendSuccessResponse(res, 200, 'Job fetched successfully', job);
  } catch (error) {
    sendErrorResponse(res, 500, 'Error fetching job', error.message);
  }
};

const createJob = async (req, res) => {
  const { title, description, codingQuestion } = req.body;

  // Basic validation
  if (!title || !description || !codingQuestion || !codingQuestion.title || !codingQuestion.description || !codingQuestion.difficulty) {
    return sendErrorResponse(res, 400, 'Missing required fields');
  }

  try {
    const newJob = new Job({
      title,
      description,
      codingQuestion: {
        title: codingQuestion.title,
        description: codingQuestion.description,
        difficulty: codingQuestion.difficulty,
        example: codingQuestion.example || { input: '', output: '' }, // Optional example
      },
    });

    const savedJob = await newJob.save();
    sendSuccessResponse(res, 201, 'Job created successfully', savedJob);
  } catch (error) {
    sendErrorResponse(res, 500, 'Error creating job', error.message);
  }
};

const autoGenerateJob = async (req, res) => {
    const { title, description } = req.body;
  
    if (!title || !description) {
      return sendErrorResponse(res, 400, 'Title and description are required');
    }
  
    try {
      // Use AI to generate a coding question
      const codingQuestion = await generateCodingQuestion(description);
      
      const newJob = new Job({
        title,
        description,
        codingQuestion,
      });
  
      const savedJob = await newJob.save();
      sendSuccessResponse(res, 201, 'Job with auto-generated question created', savedJob);
    } catch (error) {
      sendErrorResponse(res, 500, 'Error generating job', error.message);
    }
  };

module.exports = { getJobs, getJobById, createJob, autoGenerateJob };