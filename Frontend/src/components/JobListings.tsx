import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, SortDesc, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "./JobCard";

interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  jobType?: string;
  postedDate?: string;
  description: string;
  logoUrl?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  jobsPerPage: number;
}

interface JobListingsProps {
  jobs?: Job[]; // Add jobs prop as optional
  onInterviewClick?: (jobId: string) => void;
}

const JOBS_PER_PAGE = 9;

const JobListings = ({
  jobs: externalJobs, // Rename to avoid conflict with internal state
  onInterviewClick = (jobId) =>
    console.log(`Take mock interview clicked for job ${jobId}`),
}: JobListingsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: JOBS_PER_PAGE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get("http://34.207.159.158:5000/api/jobs", {
        params: { page, limit: JOBS_PER_PAGE },
        headers: { "Content-Type": "application/json" },
      });

      const fetchedJobs = response.data.data.map((job: any) => {
        const createdAt = new Date(job.createdAt);
        const daysAgo = Math.floor(
          (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          id: job._id,
          title: job.title,
          company: job.company || "Unknown Company",
          location: job.location || "Unknown Location",
          jobType: job.jobType || "Full-time",
          postedDate: `Posted ${daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}`,
          description: job.description,
          logoUrl:
            job.logoUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${(
              job.company || job.title
            ).toLowerCase().replace(/\s+/g, "")}`,
        };
      });

      setJobs(fetchedJobs);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load job listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If externalJobs are provided, use them instead of fetching
    if (externalJobs) {
      setJobs(externalJobs);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalJobs: externalJobs.length,
        jobsPerPage: externalJobs.length,
      });
      setLoading(false);
    } else {
      fetchJobs(1); // Initial fetch for page 1 if no external jobs are provided
    }
  }, [externalJobs]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchJobs(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const { currentPage, totalPages } = pagination;
    const buttons = [];
    const maxButtons = 5; // Show up to 5 page buttons at a time

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outline"
          className={`mx-1 bg-white ${i === currentPage ? "bg-gray-100" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Listings</h2>
        <p className="text-gray-600">
          Find your next opportunity and practice with a mock interview
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search jobs by title, company, or keywords"
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px] bg-white">
              <div className="flex items-center">
                <SortDesc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="bg-white">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Tabs defaultValue="grid" className="hidden md:block">
            <TabsList className="bg-white">
              <TabsTrigger
                value="grid"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gray-100" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="list"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-gray-100" : ""}
              >
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Loading jobs...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              jobType={job.jobType}
              postedDate={job.postedDate}
              description={job.description}
              logoUrl={job.logoUrl}
              onInterviewClick={onInterviewClick}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && !externalJobs && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          {renderPaginationButtons()}
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobListings;