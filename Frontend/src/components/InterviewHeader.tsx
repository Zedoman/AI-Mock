import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { toast } from "react-toastify"; // Import toast for notifications
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Code, Save, Send, Settings } from "lucide-react";

interface InterviewHeaderProps {
  jobId: string; // Required prop to fetch job details
  onSubmit?: (code: string, language: string) => void; // Updated to pass code and language
  onSave?: () => void;
  onExit?: () => void;
  onResetCode?: () => void; // New prop to reset code in parent component (if needed)
}

const InterviewHeader = ({
  jobId,
  onExit = () => console.log("Exited interview"),
  onResetCode, // Optional callback to reset code in parent component
}: InterviewHeaderProps) => {
  const navigate = useNavigate(); // Hook for navigation
  const [jobTitle, setJobTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState(""); // Manage code state locally

  // Fetch job details from backend
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        const job = response.data.data; // Assuming your backend wraps job in 'data'
        setJobTitle(`${job.title}`);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details");
        setJobTitle("Job Not Found");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Handle Exit Interview
  const handleExit = () => {
    onExit(); // Call the onExit prop if provided
    toast.success("You have exited the interview.", {
      position: "top-right",
      autoClose: 3000,
    }); // Show notification
    navigate("/"); // Redirect to home page
  };

  // Handle Reset Code
  const handleResetCode = () => {
    if (onResetCode) {
      onResetCode(); // Call the parent callback if provided
    } else {
      setCode(""); // Reset code locally if no parent callback
      toast.info("Code has been reset.", {
        position: "top-right",
        autoClose: 3000,
      }); // Show notification
    }
  };



  return (
    <header className="w-full h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary" />
          <h1 className="text-lg font-semibold truncate max-w-[300px]">
            {loading ? "Loading..." : error ? `${jobTitle} (Error)` : jobTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExit}>Exit Interview</DropdownMenuItem>
            <DropdownMenuItem>View Instructions</DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetCode}>Reset Code</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default InterviewHeader;