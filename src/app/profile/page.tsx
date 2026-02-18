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

