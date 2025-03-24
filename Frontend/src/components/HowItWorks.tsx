import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { ChevronRight, Briefcase, Code, Lightbulb } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How MockInterview Works
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Follow these simple steps to prepare for your next technical interview with our AI-powered platform.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-xl">1</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Select a Job Position
                  </h2>
                </div>
                <p className="text-gray-600">
                  Start by browsing our curated list of tech job positions. Each job listing includes a tailored coding challenge designed to match the skills required for that role. Whether you're aiming for a Software Engineer, Data Scientist, or Frontend Developer position, we’ve got you covered.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                  <Briefcase className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-xl">2</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Take a Mock Interview
                  </h2>
                </div>
                <p className="text-gray-600">
                  Dive into a realistic coding interview experience with our LeetCode-style interface. Solve coding challenges in your preferred programming language (JavaScript, Python, or Java) using our full-featured code editor. Test your code against multiple test cases and see the results in real-time.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                  <Code className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-xl">3</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Get AI-Powered Feedback
                  </h2>
                </div>
                <p className="text-gray-600">
                  After submitting your solution, receive detailed feedback from our AI. Get insights on your code’s correctness, time and space complexity, readability, and edge cases. If there’s a more efficient solution, our AI will provide an optimized approach with explanations to help you improve.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                  <Lightbulb className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Button
              className="group"
              onClick={handleGetStartedClick}
            >
              Get Started Now
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
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

export default HowItWorks;