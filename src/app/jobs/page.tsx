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
