import React from "react";
import {
  CheckCircle,
  AlertCircle,
  Code,
  Lightbulb,
  ArrowRight,
  Clock,
  Cpu,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface FeedbackPanelProps {
  score?: number;
  timeComplexity?: string;
  spaceComplexity?: string;
  feedback?: string[];
  improvements?: string[];
  optimizedSolution?: string;
  isVisible?: boolean;
  onClose?: () => void;
  showOptimizedSolution?: boolean; // Add this prop to the interface
}

const FeedbackPanel = ({
  score = 85,
  timeComplexity = "O(n)",
  spaceComplexity = "O(1)",
  feedback = [
    "Good job implementing the solution efficiently",
    "Your variable naming is clear and descriptive",
    "The code handles edge cases appropriately",
  ],
  improvements = [
    "Consider using a more efficient data structure for lookups",
    "The nested loop could be optimized further",
    "Add more comments to explain your thought process",
  ],
  optimizedSolution = `function optimizedSolution(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}`,
  isVisible = true,
  onClose = () => {},
  showOptimizedSolution = false, // Default to false
}: FeedbackPanelProps) => {
  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes("1") || complexity.includes("log"))
      return "text-green-500";
    if (complexity.includes("n")) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-full bg-background p-4 rounded-lg border border-border shadow-lg relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-2xl font-bold mb-4">AI Code Review</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={cn("text-3xl font-bold", getScoreColor(score))}>
                {score}%
              </span>
              <Progress value={score} className="w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Time Complexity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={cn(
                "text-2xl font-bold",
                getComplexityColor(timeComplexity),
              )}
            >
              {timeComplexity}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              Space Complexity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={cn(
                "text-2xl font-bold",
                getComplexityColor(spaceComplexity),
              )}
            >
              {spaceComplexity}
            </span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          {showOptimizedSolution && (
            <TabsTrigger value="optimized">Optimized Solution</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                What You Did Well
              </CardTitle>
              <CardDescription>
                Here's what the AI liked about your solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Suggested Improvements
              </CardTitle>
              <CardDescription>
                Here's how you can improve your solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {showOptimizedSolution && (
          <TabsContent value="optimized" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  Optimized Solution
                </CardTitle>
                <CardDescription>
                  Here's an optimized version of the solution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{optimizedSolution}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Try Again</Button>
        <Button>Next Question</Button>
      </div>
    </div>
  );
};

export default FeedbackPanel;