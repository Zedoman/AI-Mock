import React from "react";
import { Building2, MapPin, BriefcaseBusiness, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; // Add React Router for navigation

interface JobCardProps {
  id: string; // Make id required
  title?: string;
  company?: string;
  location?: string;
  jobType?: string;
  postedDate?: string;
  description?: string;
  logoUrl?: string;
  onInterviewClick?: (jobId: string) => void;
}

const JobCard = ({
  id,
  title = "Senior Frontend Developer",
  company = "TechCorp Inc.",
  location = "San Francisco, CA",
  jobType = "Full-time",
  postedDate = "Posted 2 days ago",
  description = "We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern web technologies to join our growing team.",
  logoUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp",
  onInterviewClick = () => console.log("Take mock interview clicked"),
}: JobCardProps) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleInterviewClick = () => {
    onInterviewClick(id); // Call the prop function
    navigate(`/interview/${id}`); // Navigate to interview page with jobId
  };

  return (
    <Card className="w-full max-w-md h-full flex flex-col bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-800">
              {title}
            </CardTitle>
            <div className="flex items-center mt-1 text-gray-600">
              <Building2 className="h-4 w-4 mr-1" />
              <CardDescription className="font-medium">
                {company}
              </CardDescription>
            </div>
          </div>
          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={logoUrl}
              alt={`${company} logo`}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BriefcaseBusiness className="h-3.5 w-3.5 mr-1" />
            <span>{jobType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{postedDate}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          className={cn(
            "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium",
            "transition-all duration-200 transform hover:translate-y-[-2px]"
          )}
          onClick={handleInterviewClick}
        >
          Take Mock Interview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;