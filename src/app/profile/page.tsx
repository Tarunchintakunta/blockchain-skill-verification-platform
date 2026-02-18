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
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Award className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Avatar + Info Card */}
              <Card className="lg:col-span-1">
                <CardContent className="flex flex-col items-center pt-6 pb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {initials}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {profile?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                  <Badge variant="secondary" className="mt-2 capitalize">
                    {profile?.role}
                  </Badge>
                  {profile?.organizationName && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                      <Building2 className="h-4 w-4" />
                      {profile.organizationName}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">
                      Member since{" "}
                      {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
                    </span>
                  </div>

                  <div className="mt-4 w-full border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Credentials</span>
                      <span className="font-medium text-gray-900">
                        {profile?.stats?.credentials ?? 0}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">Assessments</span>
                      <span className="font-medium text-gray-900">
                        {profile?.stats?.assessments ?? 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Profile + Wallet */}
              <div className="space-y-6 lg:col-span-2">
                <EditProfileForm
                  profile={profile}
                  onSuccess={fetchProfile}
                />
                <WalletSection
                  walletAddress={profile?.walletAddress ?? null}
                  onSuccess={fetchProfile}
                />
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab (candidates only) */}
          {isCandidate && (
            <TabsContent value="skills">
              <SkillsTab skills={profile?.skills ?? []} />
            </TabsContent>
          )}

          {/* Activity Tab */}
          <TabsContent value="activity">
            <ActivityTab activity={activity} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------- Edit Profile Form ---------- */

function EditProfileForm({
  profile,
  onSuccess,
}: {
  profile: ProfileData | null;
  onSuccess: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name, bio: profile.bio ?? "" });
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/users/profile", {
