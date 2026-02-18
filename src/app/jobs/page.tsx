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
