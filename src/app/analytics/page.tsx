"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Shield,
  Briefcase,
  Globe,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

// --- Demo Data ---

const skillsDemandData = [
  { skill: "JavaScript", demand: 4820, fill: "#3b82f6" },
  { skill: "Python", demand: 4310, fill: "#6366f1" },
  { skill: "Solidity", demand: 3750, fill: "#8b5cf6" },
  { skill: "React", demand: 3640, fill: "#06b6d4" },
  { skill: "TypeScript", demand: 3290, fill: "#10b981" },
  { skill: "Node.js", demand: 2980, fill: "#3b82f6" },
  { skill: "Rust", demand: 2540, fill: "#f59e0b" },
  { skill: "Go", demand: 2210, fill: "#6366f1" },
  { skill: "AWS", demand: 2080, fill: "#10b981" },
  { skill: "Docker", demand: 1870, fill: "#8b5cf6" },
];

const verificationTrendData = [
  { month: "Sep", verifications: 1240 },
  { month: "Oct", verifications: 1580 },
  { month: "Nov", verifications: 1930 },
  { month: "Dec", verifications: 2270 },
  { month: "Jan", verifications: 2840 },
  { month: "Feb", verifications: 3510 },
];

const assessmentPerformanceData = [
  { category: "Blockchain", passRate: 72, avgScore: 78 },
  { category: "Web Dev", passRate: 81, avgScore: 83 },
  { category: "Data Science", passRate: 68, avgScore: 74 },
  { category: "DevOps", passRate: 75, avgScore: 79 },
  { category: "Security", passRate: 64, avgScore: 71 },
  { category: "Mobile", passRate: 78, avgScore: 82 },
];

const credentialDistributionData = [
  { name: "Certification", value: 40 },
  { name: "Degree", value: 25 },
  { name: "Badge", value: 20 },
  { name: "Diploma", value: 15 },
];

const PIE_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b"];

const jobMarketData = [
  { month: "Sep", postings: 320, applications: 1840 },
  { month: "Oct", postings: 410, applications: 2290 },
  { month: "Nov", postings: 380, applications: 2150 },
  { month: "Dec", postings: 290, applications: 1760 },
  { month: "Jan", postings: 520, applications: 3100 },
  { month: "Feb", postings: 640, applications: 3840 },
];

const matchScoreData = [
  { range: "0–25%", count: 183 },
  { range: "26–50%", count: 496 },
  { range: "51–75%", count: 812 },
  { range: "76–100%", count: 539 },
];

// --- Overview Stats ---

const overviewStats = [
  {
    title: "Total Credentials Issued",
    value: "12,847",
    change: "+18% this month",
    icon: Award,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Total Assessments",
    value: "34,219",
    change: "+12% this month",
    icon: BarChart3,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    title: "Active Jobs",
    value: "2,641",
    change: "+24% this month",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    title: "Verified Skills",
    value: "89,403",
    change: "+31% this month",
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Platform Users",
    value: "18,562",
    change: "+9% this month",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    title: "Avg. Match Score",
    value: "73.4%",
    change: "+5% this month",
