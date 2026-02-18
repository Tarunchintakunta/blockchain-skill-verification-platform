"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate, formatCurrency } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  requiredSkillIds: string[];
  preferredSkillIds: string[];
  status: string;
  createdAt: string;
  _count?: { applications: number };
};

type Application = {
  id: string;
  jobId: string;
  status: string;
  coverLetter: string | null;
  createdAt: string;
  job?: Job;
  matchScore?: number;
};

type MatchResult = {
  jobId: string;
  match: {
    overallScore: number;
    recommendation: string;
    confidence: string;
    skillBreakdown: Record<string, unknown>;
  };
};

const jobTypeColors: Record<string, string> = {
  "full-time": "bg-blue-100 text-blue-800",
  "part-time": "bg-purple-100 text-purple-800",
  contract: "bg-amber-100 text-amber-800",
  remote: "bg-emerald-100 text-emerald-800",
};

const applicationStatusConfig: Record<
  string,
  { label: string; variant: "default" | "warning" | "success" | "destructive" | "secondary" }
> = {
  pending: { label: "Pending", variant: "warning" },
  reviewed: { label: "Reviewed", variant: "secondary" },
  shortlisted: { label: "Shortlisted", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  accepted: { label: "Accepted", variant: "success" },
};

export default function JobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [postJobOpen, setPostJobOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchJobs();
    }
  }, [status, router]);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }

  const user = session?.user as { name: string; email: string; role: string };
  const role = user?.role || "candidate";
  const isCandidate = role === "candidate";
  const isEmployer = role === "employer";

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || job.type === filterType;
    return matchesSearch && matchesType;
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEmployer ? "Job Postings" : "Browse Jobs"}
            </h1>
            <p className="mt-1 text-gray-500">
              {isEmployer
                ? "Manage your job listings and review applications"
                : "Find your next opportunity with blockchain-verified credentials"}
            </p>
          </div>

          {isEmployer && (
            <Dialog open={postJobOpen} onOpenChange={setPostJobOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>
                    Create a new job listing to find qualified candidates.
                  </DialogDescription>
                </DialogHeader>
                <PostJobForm
                  onSuccess={() => {
                    setPostJobOpen(false);
                    fetchJobs();
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isCandidate ? (
          <CandidateView
            jobs={filteredJobs}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            setSelectedJob={setSelectedJob}
            setDetailOpen={setDetailOpen}
          />
        ) : isEmployer ? (
          <EmployerView
            jobs={filteredJobs}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            setSelectedJob={setSelectedJob}
            setDetailOpen={setDetailOpen}
          />
        ) : (
          <PublicJobListings
            jobs={filteredJobs}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setDetailOpen(true);
            }}
          />
        )}
      </main>

      {selectedJob && (
        <JobDetailDialog
          job={selectedJob}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          showApply={isCandidate}
        />
      )}
    </div>
  );
}

function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by title or company..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-Time</SelectItem>
            <SelectItem value="part-time">Part-Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function JobCard({
  job,
  onClick,
  actionSlot,
}: {
  job: Job;
  onClick: () => void;
  actionSlot?: React.ReactNode;
}) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base truncate">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3" />
                {job.company}
              </CardDescription>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
              jobTypeColors[job.type] || "bg-gray-100 text-gray-800"
            }`}
          >
            {job.type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">
          {job.description}
        </p>
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {job.location}
          </div>
          {(job.salaryMin || job.salaryMax) && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
              {job.salaryMin && job.salaryMax
                ? `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`
                : job.salaryMin
                ? `From ${formatCurrency(job.salaryMin)}`
                : `Up to ${formatCurrency(job.salaryMax)}`}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            {job.requiredSkillIds.length} required skill
            {job.requiredSkillIds.length !== 1 ? "s" : ""}
            {job.preferredSkillIds.length > 0 &&
              `, ${job.preferredSkillIds.length} preferred`}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            Posted {formatDate(job.createdAt)}
          </div>
        </div>
        {actionSlot && (
          <div
            className="mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {actionSlot}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Briefcase className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No jobs found
        </h3>
        <p className="mt-1 text-gray-500">{message}</p>
      </CardContent>
    </Card>
  );
}

function PublicJobListings({
  jobs,
  loading,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onSelectJob,
}: {
  jobs: Job[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  onSelectJob: (job: Job) => void;
}) {
  return (
    <>
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState message="No jobs match your search criteria" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} />
          ))}
        </div>
      )}
    </>
  );
}

function CandidateView({
  jobs,
  loading,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  setSelectedJob,
  setDetailOpen,
}: {
  jobs: Job[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  setSelectedJob: (job: Job | null) => void;
  setDetailOpen: (open: boolean) => void;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<MatchResult[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);

  async function fetchApplications() {
    setAppsLoading(true);
    try {
      const res = await fetch("/api/jobs/apply");
      const data = await res.json();
      if (data.success) setApplications(data.data || []);
    } catch {
      // fail silently
    } finally {
      setAppsLoading(false);
    }
  }

  async function fetchMatches() {
    setMatchLoading(true);
    try {
      const res = await fetch("/api/matching");
      const data = await res.json();
      if (data.success) setMatchedJobs(data.data || []);
    } catch {
      // fail silently
    } finally {
      setMatchLoading(false);
    }
  }

  function handleTabChange(value: string) {
    if (value === "applications") fetchApplications();
    if (value === "recommended") fetchMatches();
  }

  const jobById = (id: string) => jobs.find((j) => j.id === id);

  return (
    <Tabs defaultValue="browse" onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
        <TabsTrigger value="applications">My Applications</TabsTrigger>
        <TabsTrigger value="recommended">Recommended</TabsTrigger>
      </TabsList>

      <TabsContent value="browse">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
        />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState message="No jobs match your search criteria" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => {
                  setSelectedJob(job);
                  setDetailOpen(true);
                }}
                actionSlot={
                  <ApplyButton
                    job={job}
                    onApplied={() => {}}
                  />
                }
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="applications">
        {appsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-1 text-gray-500">
                Browse jobs and apply to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const job = app.job || jobById(app.jobId);
              const statusConf =
                applicationStatusConfig[app.status] ||
                applicationStatusConfig.pending;
              return (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {job?.title || "Unknown Position"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job?.company || "Unknown Company"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {app.matchScore !== undefined && (
                          <Badge variant="secondary" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {app.matchScore}% match
                          </Badge>
                        )}
                        <Badge variant={statusConf.variant}>
                          {statusConf.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      {job?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="recommended">
        {matchLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : matchedJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No recommendations yet
              </h3>
              <p className="mt-1 text-gray-500">
                Add skills and credentials to get personalized job matches
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...matchedJobs]
              .sort((a, b) => b.match.overallScore - a.match.overallScore)
              .map((match) => {
                const job = jobById(match.jobId);
                if (!job) return null;
                const score = match.match.overallScore;
                const scoreColor =
                  score >= 80
                    ? "bg-emerald-100 text-emerald-800"
                    : score >= 60
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800";
                return (
                  <JobCard
                    key={match.jobId}
                    job={job}
                    onClick={() => {
                      setSelectedJob(job);
                      setDetailOpen(true);
                    }}
                    actionSlot={
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1 ${scoreColor}`}
                        >
                          <TrendingUp className="h-3 w-3" />
                          {score}% match
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {match.match.recommendation}
                        </span>
                      </div>
                    }
                  />
                );
              })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function ApplyButton({
  job,
  onApplied,
}: {
  job: Job;
  onApplied: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            at {job.company} &middot; {job.location}
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm
          job={job}
          onSuccess={() => {
            setOpen(false);
            onApplied();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function ApplicationForm({
  job,
  onSuccess,
}: {
  job: Job;
  onSuccess: () => void;
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    overallScore: number;
    recommendation: string;
    skillBreakdown: Record<string, unknown>;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, coverLetter }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit application");
        return;
      }

      if (data.success && data.data?.matchResult) {
        setResult(data.data.matchResult);
      } else {
        onSuccess();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const score = result.overallScore;
    const scoreColor =
      score >= 80
        ? "text-emerald-600"
        : score >= 60
        ? "text-blue-600"
        : "text-amber-600";
    const scoreBg =
      score >= 80
        ? "bg-emerald-50"
        : score >= 60
        ? "bg-blue-50"
        : "bg-amber-50";

    return (
      <div className={`rounded-lg p-6 ${scoreBg} text-center space-y-3`}>
        <TrendingUp className={`mx-auto h-10 w-10 ${scoreColor}`} />
        <h3 className="text-lg font-semibold text-gray-900">
          Application Submitted!
        </h3>
        <p className={`text-4xl font-bold ${scoreColor}`}>{score}%</p>
        <p className="text-sm text-gray-600">Match Score</p>
        <p className="text-sm text-gray-700 capitalize font-medium">
          {result.recommendation}
        </p>
        <Button className="w-full" onClick={onSuccess}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          {job.location}
        </div>
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
            {job.salaryMin && job.salaryMax
