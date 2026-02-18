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
    icon: TrendingUp,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
];

// --- Custom Tooltip ---

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
        {label && (
          <p className="mb-1 text-xs font-semibold text-gray-700">{label}</p>
        )}
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// --- Page Component ---

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as { name: string; email: string; role: string };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Platform Analytics
            </h1>
            <p className="mt-1 text-gray-500">
              Real-time market insights and platform performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
            <Clock className="h-4 w-4" />
            <span>Updated just now</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {overviewStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-emerald-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`rounded-lg ${stat.bg} p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts via Tabs */}
        <Tabs defaultValue="skills">
          <TabsList className="mb-6">
            <TabsTrigger value="skills">Skills Demand</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="jobs">Job Market</TabsTrigger>
            <TabsTrigger value="matches">Match Scores</TabsTrigger>
          </TabsList>

          {/* Skills Demand */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Skills Demand</CardTitle>
                    <CardDescription>
                      Top 10 most demanded skills across all active job postings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart
                    data={skillsDemandData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="skill"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="demand" name="Job Postings" radius={[4, 4, 0, 0]}>
                      {skillsDemandData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
