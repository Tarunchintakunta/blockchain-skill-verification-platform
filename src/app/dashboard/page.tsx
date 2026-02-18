"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Award,
  FileCheck,
  Briefcase,
  Shield,
  TrendingUp,
  Link as LinkIcon,
  BarChart3,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DashboardData = Record<string, number>;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/users/dashboard")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setStats(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as { name: string; email: string; role: string };
  const role = user?.role || "candidate";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-gray-500 capitalize">
            {role} Dashboard
          </p>
        </div>

        {role === "candidate" && <CandidateDashboard stats={stats} />}
        {role === "employer" && <EmployerDashboard stats={stats} />}
        {role === "institution" && <InstitutionDashboard stats={stats} />}
      </main>
    </div>
  );
}

function CandidateDashboard({ stats }: { stats: DashboardData }) {
  const cards = [
    {
      title: "Total Credentials",
      value: stats.totalCredentials || 0,
      icon: Award,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Verified Credentials",
      value: stats.verifiedCredentials || 0,
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Assessments Taken",
      value: stats.assessmentsTaken || 0,
      icon: FileCheck,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore || 0}%`,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Job Applications",
      value: stats.jobMatches || 0,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Blockchain Verifications",
      value: stats.blockchainVerifications || 0,
      icon: LinkIcon,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
