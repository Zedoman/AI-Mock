import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InterviewHeader from "@/components/InterviewHeader";
import QuestionPanel from "@/components/QuestionPanel";
import CodeEditor from "@/components/CodeEditor";
import FeedbackPanel from "@/components/FeedbackPanel";
import { toast } from "react-toastify";

const Interview = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [language, setLanguage] = useState("javascript");

  // Initialize code state, checking localStorage for saved code
  const [code, setCode] = useState(() => {
    if (!jobId) {
      switch (language) {
        case "javascript":
          return "// Write your code here\n";
        case "python":
          return "# Write your code here\n";
        case "java":
          return "// Write your code here\n";
        default:
          return "// Write your code here\n";
      }
    }

    const savedCode = localStorage.getItem(`code_${jobId}_${language}`);
    if (savedCode) {
      return savedCode;
    }

    switch (language) {
      case "javascript":
        return "// Write your code here twoSum(nums, target)\n";
      case "python":
        return "# Write your code here twoSum(nums, target)\n";
      case "java":
        return "// Write your code here twoSum(nums, target)\n";
      default:
        return "// Write your code here twoSum(nums, target)\n";
    }
  });

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    score: number;
    timeComplexity: string;
    spaceComplexity: string;
    feedback: string[];
    improvements: string[];
    optimizedSolution: string;
    showOptimizedSolution: boolean;
  } | null>(null);
  const [problemTitle, setProblemTitle] = useState<string>("");
  const [problemType, setProblemType] = useState<string>("");
  const [testCases, setTestCases] = useState<
    { input: string; expectedOutput: string }[]
  >([]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`https://34.207.159.158/api/jobs/${jobId}`);
        const job = response.data.data;
        setProblemTitle(job.codingQuestion.title);
        setProblemType(job.codingQuestion.title);
        setTestCases(job.codingQuestion.testCases || []);
        console.log("Problem Title:", job.codingQuestion.title);
        console.log("Test Cases:", job.codingQuestion.testCases);
      } catch (err) {
        console.error("Error fetching job data:", err);
      }
    };
    if (jobId) fetchJobData();
  }, [jobId]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const savedCode = localStorage.getItem(`code_${jobId}_${newLanguage}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(() => {
        switch (newLanguage) {
          case "javascript":
            return "// Write your code here\n";
          case "python":
            return "# Write your code here\n";
          case "java":
            return "// Write your code here\n";
          default:
            return "// Write your code here\n";
        }
      });
    }
  };

  const parseAIFeedback = (aiFeedback: string, selectedLanguage: string, problemTitle: string) => {
    let score = 85;
    let timeComplexity = "O(n²)";
    let spaceComplexity = "O(1)";
    const feedback: string[] = [];
    const improvements: string[] = [];
    let optimizedSolution = "";
    let showOptimizedSolution = false;

    const optimizedSolutionsMap: { [key: string]: { [key: string]: string; timeComplexity: string; spaceComplexity: string } } = {
      "Two Sum": {
        javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        python: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      "Reverse a String": {
        javascript: `function reverse(str) {
  return str.split("").reverse().join("");
}`,
        python: `def reverseString(s):
    return s[::-1]`,
        java: `class Solution {
    public String reverseString(String s) {
        return new StringBuilder(s).reverse().toString();
    }
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    };

    const compareTimeComplexities = (submitted: string, optimized: string): boolean => {
      const complexityRank: { [key: string]: number } = {
        "O(1)": 1,
        "O(log n)": 2,
        "O(n)": 3,
        "O(n log n)": 4,
        "O(n²)": 5,
        "O(2^n)": 6,
      };
      const submittedRank = complexityRank[submitted] || 10;
      const optimizedRank = complexityRank[optimized] || 10;
      return optimizedRank < submittedRank;
    };

    const sections = aiFeedback.split(/\n\n(?=\*\*)/);
    let optimizedTimeComplexityFromAI = "O(n)";

    sections.forEach((section) => {
      if (section.startsWith("**1. Correctness:**")) {
        const content = section.replace("**1. Correctness:**\n\n", "").trim();
        feedback.push(content);
        if (content.includes("largely correct")) {
          score = 90;
        } else if (content.includes("incorrect")) {
          score = 60;
        }
      } else if (section.startsWith("**2. Time and Space Complexity Analysis:**")) {
        const content = section.replace("**2. Time and Space Complexity Analysis:**\n\n", "").trim();
        const timeMatch = content.match(/\* \*\*Time Complexity:\*\* (O\([^\)]+\))/);
        const spaceMatch = content.match(/\* \*\*Space Complexity:\*\* (O\([^\)]+\))/);
        if (timeMatch) timeComplexity = timeMatch[1];
        if (spaceMatch) spaceComplexity = spaceMatch[1];
        if (timeComplexity === "O(n²)") score -= 10;
        else if (timeComplexity === "O(n log n)") score -= 5;
        else if (timeComplexity === "O(n)") score += 5;
        if (spaceComplexity === "O(n)") score -= 5;
        else if (spaceComplexity === "O(1)") score += 5;
      } else if (section.startsWith("**3. Readability:**")) {
        const content = section.replace("**3. Readability:**\n\n", "").trim();
        feedback.push(content);
        if (content.includes("reasonably readable")) score += 5;
        else if (content.includes("poorly readable")) score -= 10;
      } else if (section.startsWith("**4. Edge Cases:**")) {
        const content = section.replace("**4. Edge Cases:**\n\n", "").trim();
        feedback.push(content);
        if (content.includes("handles")) score += 5;
        else if (content.includes("doesn't explicitly handle")) score -= 5;
      } else if (section.startsWith("**5. Suggestions:**")) {
        const content = section.replace("**5. Suggestions:**\n\n", "").trim();
        const suggestionLines = content.split("\n").filter(line => line.startsWith("* "));
        suggestionLines.forEach(line => {
          improvements.push(line.replace("* ", "").trim());
        });
      } else if (section.startsWith("**6. Alternative Solution")) {
        const content = section.replace("**6. Alternative Solution (Hash Map Approach):**", "").trim();
        const codeBlockMatch = content.match(/```[a-z]+\n([\s\S]*?)\n```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          optimizedSolution = codeBlockMatch[1].trim();
          const timeComplexityMatch = content.match(/time complexity to (O\([^\)]+\))/);
          if (timeComplexityMatch) {
            optimizedTimeComplexityFromAI = timeComplexityMatch[1];
          }
          showOptimizedSolution = compareTimeComplexities(timeComplexity, optimizedTimeComplexityFromAI);
        } else {
          const problemSolutions = optimizedSolutionsMap[problemTitle] || optimizedSolutionsMap["Two Sum"];
          optimizedSolution = problemSolutions[selectedLanguage.toLowerCase()] || problemSolutions.python;
          const optimizedTimeComplexity = problemSolutions.timeComplexity;
          showOptimizedSolution = compareTimeComplexities(timeComplexity, optimizedTimeComplexity);
        }

        const remainingContent = content.split("```")[2]?.split("```")[1]?.trim() || "";
        const additionalLines = remainingContent.split("\n").filter(line => line.startsWith("* "));
        additionalLines.forEach(line => {
          improvements.push(line.replace("* ", "").trim());
        });
      }
    });

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      timeComplexity,
      spaceComplexity,
      feedback,
      improvements,
      optimizedSolution,
      showOptimizedSolution,
    };
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    setConsoleOutput(["Submitting code..."]);
    setShowFeedback(false);
  
    try {
      const cleanedCode = code.replace(/\/\/ Write your code here\n/, '').trim();
      if (!cleanedCode) {
        setConsoleOutput(["Error: No code to submit"]);
        setIsSubmitting(false);
        return;
      }
  
      const response = await axios.post(
        "https://34.207.159.158/api/code/submit",
        {
          userId: "user123",
          jobId,
          code: cleanedCode,
          language,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Submission failed");
      }
  
      const result = response.data;
      const compilationResult = result.data.compilationResult;
      const testCaseResults = compilationResult.testCaseResults;
  
      // Log the raw testCaseResults to debug
      console.log("Raw testCaseResults:", JSON.stringify(testCaseResults, null, 2));
  
      for (let i = 0; i < testCaseResults.length; i++) {
        const testCase = testCaseResults[i];
        const input = testCase.input ?? "N/A"; // Fallback if undefined
        const expectedOutput = testCase.expectedOutput ?? "N/A"; // Fallback if undefined
        const actualOutput = testCase.output ?? "N/A";
        const success = testCase.success ?? false;
  
        if (testCase.input === undefined) {
          console.warn(`Test Case ${i + 1}: 'input' field is undefined`);
        }
        if (testCase.expectedOutput === undefined) {
          console.warn(`Test Case ${i + 1}: 'expectedOutput' field is undefined`);
        }
  
        setConsoleOutput((prev) => [
          ...prev,
          `Test Case ${i + 1}:`,
          `Input: ${input}`,
          `Expected Output: ${expectedOutput}`,
          `Actual Output: ${actualOutput}`,
          success ? "✅ Passed" : "❌ Failed",
          "-------------------",
        ]);
  
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
  
      const allPassed = testCaseResults.every((tc: any) => tc.success);
      setConsoleOutput((prev) => [
        ...prev,
        `Submission Result: ${allPassed ? "Success ✅" : "Failed ❌"}`,
      ]);
  
      const parsedFeedback = parseAIFeedback(result.data.aiFeedback, language, problemTitle);
      setFeedbackData(parsedFeedback);
      setShowFeedback(true);
    } catch (err) {
      setConsoleOutput((prev) => [
        ...prev,
        "Submission Failed: " + (err.response?.data?.message || err.message),
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    setCode(""); // Reset code in parent
  };

  const handleSave = () => {
    if (!jobId) {
      toast.error("Cannot save code: No job ID provided", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Clean the code before saving
    const cleanedCode = code.replace(/\/\/ Write your code here\n/, '').trim();
    if (!cleanedCode) {
      toast.error("Cannot save empty code", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      localStorage.setItem(`code_${jobId}_${language}`, cleanedCode);
      toast.success("Code saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to save code: Local storage is full.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleReset = () => {
    setCode(() => {
      switch (language) {
        case "javascript":
          return "// Write your code here\n";
        case "python":
          return "# Write your code here\n";
        case "java":
          return "// Write your code here\n";
        default:
          return "// Write your code here\n";
      }
    });
    setConsoleOutput([]);
  };

  if (!jobId) {
    return <div className="p-4 text-red-500">Error: No job ID provided</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <InterviewHeader
        jobId={jobId}
        onSubmit={handleSubmit}
        onSave={handleSave}
        onResetCode={handleResetCode}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full overflow-auto border-r border-gray-200">
          <QuestionPanel jobId={jobId} />
        </div>
        <div className="w-1/2 h-full flex flex-col">
          <CodeEditor
            code={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onSave={handleSave}
            consoleOutput={consoleOutput}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      {showFeedback && feedbackData && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <FeedbackPanel
              score={feedbackData.score}
              timeComplexity={feedbackData.timeComplexity}
              spaceComplexity={feedbackData.spaceComplexity}
              feedback={feedbackData.feedback}
              improvements={feedbackData.improvements}
              optimizedSolution={feedbackData.optimizedSolution}
              isVisible={showFeedback}
              onClose={() => setShowFeedback(false)}
              showOptimizedSolution={feedbackData.showOptimizedSolution}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;