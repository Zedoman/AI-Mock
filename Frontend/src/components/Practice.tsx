import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import JobCard from "./JobCard";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType?: string;
  postedDate?: string;
  logoUrl?: string;
}

const Practice = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleInterviewClick = (jobId: string) => {
    navigate(`/interview?jobId=${jobId}`);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Check if the response has a 'data' field and it's an array
        if (data && Array.isArray(data.data)) {
          setJobs(data.data); // Extract the 'data' field, which is the array of jobs
        } else {
          throw new Error("API response does not contain an array in 'data' field");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setJobs([]); // Reset jobs to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  console.log("Jobs State:", jobs);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Practice Mock Interviews
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Select a job position below to start a mock interview and test your coding skills with real-world challenges.
          </p>
        </div>
      </section>

      {/* Job Cards Section */}
      <section className="w-full py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-600">Loading jobs...</div>
          ) : error ? (
            <div className="text-center text-red-600">
              Error: {error}
              <button
                onClick={() => window.location.reload()}
                className="ml-2 text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : !Array.isArray(jobs) ? (
            <div className="text-center text-red-600">
              Error: Jobs data is not an array
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-600">No jobs available.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  description={job.description}
                  jobType={job.jobType || "Full-time"}
                  postedDate={job.postedDate || "Posted recently"}
                  logoUrl={job.logoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=company"}
                  onInterviewClick={handleInterviewClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">MockInterview</h3>
            <p className="text-gray-400">
              Helping developers ace technical interviews with AI-powered
              practice.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Coding Challenges
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} MockInterview. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Practice;