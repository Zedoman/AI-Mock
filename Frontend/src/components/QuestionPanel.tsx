import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface CodingQuestion {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  example: Example;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  codingQuestion: CodingQuestion;
  company?: string; // Optional, fallback if not present
}

interface QuestionPanelProps {
  jobId: string; // Required to fetch specific job
  onNavigate?: (direction: "prev" | "next") => void;
}

const QuestionPanel = ({
  jobId,
  onNavigate = (direction) => console.log(`Navigating ${direction}`),
}: QuestionPanelProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job details from backend
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://34.207.159.158:5000/api/jobs/${jobId}`);
        const fetchedJob = response.data.data; // Assuming backend wraps in 'data'
        setJob(fetchedJob);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-auto bg-white border-r border-gray-200 p-4">
        <p className="text-gray-700">Loading question...</p>
      </div>
    );
  }

  if (error || !job || !job.codingQuestion) {
    return (
      <div className="flex flex-col h-full overflow-auto bg-white border-r border-gray-200 p-4">
        <p className="text-red-700">{error || "No question available"}</p>
      </div>
    );
  }

  const {
    title: jobTitle,
    company = "Unknown Company",
    codingQuestion: { title: questionTitle, description, difficulty, example },
  } = job;

  // Map backend data to component props
  const timeLimit = 45; // Hardcoded since backend doesn’t provide it
  const examples = [example]; // Single example from backend as an array
  const constraints = ["No additional libraries allowed"]; // Fallback
  const hints = ["Think about the problem step-by-step"]; // Fallback

  return (
    <div className="flex flex-col h-full overflow-auto bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{questionTitle}</h1>
            <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
              <span>{jobTitle}</span>
              <span>•</span>
              <span>{company}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={cn("border", getDifficultyColor(difficulty))}>
              {difficulty}
            </Badge>
            
          </div>
        </div>
        
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-gray-700">{description}</p>

              {constraints.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold flex items-center">
                    <Info className="w-4 h-4 mr-2 text-blue-500" />
                    Constraints:
                  </h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {constraints.map((constraint, index) => (
                      <li key={index} className="text-gray-700">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">
                  Example {index + 1}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Input:
                    </div>
                    <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
                      {example.input}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Output:
                    </div>
                    <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
                      {example.output}
                    </div>
                  </div>
                  {example.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Explanation:
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        {example.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="hints" className="space-y-4">
            {hints.length > 0 ? (
              <div className="space-y-3">
                {hints.map((hint, index) => (
                  <div key={index} className="flex p-3 bg-blue-50 rounded-md">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex p-4 bg-gray-50 rounded-md">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">
                    No hints available for this question.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionPanel;