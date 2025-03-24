import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { ChevronRight, BookOpen, Code, Lightbulb } from "lucide-react";

const Resources = () => {
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
            Resources for Interview Success
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Explore our curated resources to help you prepare for technical interviews, improve your coding skills, and boost your confidence.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Articles */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Articles & Blogs
                  </h2>
                </div>
                <p className="text-gray-600">
                  Read our in-depth articles and blog posts on topics like system design, data structures, algorithms, and behavioral interviews. Learn from industry experts and get actionable tips to ace your next interview.
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Top 10 Data Structures to Master for Interviews
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      How to Prepare for a System Design Interview
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Common Behavioral Questions and How to Answer Them
                    </a>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Coding Challenges */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <Code className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Coding Challenges
                  </h2>
                </div>
                <p className="text-gray-600">
                  Practice coding challenges to sharpen your problem-solving skills. Our challenges range from easy to hard and cover topics like arrays, strings, dynamic programming, and more.
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Two Sum (Easy)
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Longest Substring Without Repeating Characters (Medium)
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Median of Two Sorted Arrays (Hard)
                    </a>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                  <Code className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Interview Tips */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Interview Tips
                  </h2>
                </div>
                <p className="text-gray-600">
                  Get expert advice on how to prepare for technical interviews. Learn how to approach coding problems, communicate your thought process, and handle tricky questions.
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      How to Solve Coding Problems in an Interview
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Tips for Effective Whiteboard Coding
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      What to Do When You’re Stuck on a Problem
                    </a>
                  </li>
                </ul>
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
              Start Practicing Now
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

export default Resources;