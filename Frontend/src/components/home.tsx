import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import JobListings from "./JobListings";
import { Button } from "./ui/button";
import { Briefcase, ChevronRight, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleInterviewClick = (jobId: string) => {
    // Navigate to the interview page with the selected job ID
    navigate(`/interview?jobId=${jobId}`);
  };

  const handleHowItWorksClick = () => {
    // Navigate to the How It Works page
    navigate("/how-it-works");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ace Your Next Tech Interview
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Practice with our AI-powered mock interviews tailored to specific
              job positions. Get real-time feedback and improve your coding
              skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() =>
                  document
                    .getElementById("job-listings")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-blue-700 hover:text-white"
                onClick={handleHowItWorksClick} // Add onClick handler
              >
                <Sparkles className="mr-2 h-5 text-black w-5" />
                How It Works
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
              alt="Person coding on laptop"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How Our Mock Interview Platform Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-700 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Select a Job Position
              </h3>
              <p className="text-gray-600">
                Browse through our curated list of tech job positions that match
                your skills and career goals.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-700 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Take a Mock Interview
              </h3>
              <p className="text-gray-600">
                Solve real coding challenges in our LeetCode-style interface
                with a full-featured code editor.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-700 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Get AI Feedback
              </h3>
              <p className="text-gray-600">
                Receive detailed AI-powered code reviews, optimization
                suggestions, and personalized improvement tips.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              className="group"
              onClick={() =>
                document
                  .getElementById("job-listings")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Practicing Now
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="job-listings" className="w-full py-8 px-4">
        <JobListings onInterviewClick={handleInterviewClick} />
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
            © {new Date().getFullYear()} MockInterview. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;