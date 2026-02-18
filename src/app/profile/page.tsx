"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Wallet,
  Shield,
  Award,
  FileCheck,
  Save,
  Edit2,
  Link as LinkIcon,
  Mail,
  Building2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate, truncateAddress } from "@/lib/utils";

type Skill = {
  id: string;
  skillId: string;
  level: number;
  verified: boolean;
  skill?: {
    name: string;
    category: string;
  };
};

type ProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  walletAddress: string | null;
  organizationName: string | null;
  createdAt: string;
  skills: Skill[];
  stats: {
    credentials: number;
    assessments: number;
  };
};

type RecentCredential = {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  issuedAt: string | null;
};

type RecentAttempt = {
  id: string;
  score: number | null;
  status: string;
  completedAt: string | null;
  assessment?: {
    title: string;
  };
};

type RecentApplication = {
  id: string;
  status: string;
  appliedAt: string;
  job?: {
    title: string;
    company: string;
  };
};

type ActivityData = {
  recentCredentials: RecentCredential[];
  recentAttempts: RecentAttempt[];
  recentApplications: RecentApplication[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activity, setActivity] = useState<ActivityData>({
    recentCredentials: [],
    recentAttempts: [],
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchProfile();
      fetchActivity();
    }
  }, [status, router]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/users/profile");
      const data = await res.json();
      if (data.success) setProfile(data.data);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActivity() {
    try {
      const [credRes, assessRes, jobRes] = await Promise.all([
        fetch("/api/credentials?limit=5"),
        fetch("/api/assessments/attempts?limit=5"),
        fetch("/api/jobs/applications?limit=5"),
      ]);
      const [credData, assessData, jobData] = await Promise.all([
        credRes.json(),
        assessRes.json(),
        jobRes.json(),
      ]);
      setActivity({
        recentCredentials: credData.success ? credData.data.slice(0, 5) : [],
        recentAttempts: assessData.success ? assessData.data.slice(0, 5) : [],
        recentApplications: jobData.success ? jobData.data.slice(0, 5) : [],
      });
    } catch {
      // Activity data is non-critical; ignore fetch errors
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as { name: string; email: string; role: string };

  const initials = (profile?.name || user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isCandidate = profile?.role === "candidate";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            {isCandidate && (
              <TabsTrigger value="skills" className="gap-2">
                <Shield className="h-4 w-4" />
                Skills
              </TabsTrigger>
            )}
            <TabsTrigger value="activity" className="gap-2">
              <FileCheck className="h-4 w-4" />
              Activity
