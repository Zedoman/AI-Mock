const express = require('express');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const jobRoutes = require('./routes/jobRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const codeReviewRoutes = require('./routes/codeReviewRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');


const app = express();

//cors
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/code', codeReviewRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to IGalaxy API" });
});

startServer();