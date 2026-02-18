"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  Plus,
  Clock,
  Trophy,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Lightbulb,
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
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

type AssessmentQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
};

type Assessment = {
  id: string;
  title: string;
  description: string | null;
  skillId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  passingScore: number;
  totalAttempts: number;
  averageScore: number | null;
  status: string;
  createdAt: string;
  questions: AssessmentQuestion[];
};

type SubmissionResult = {
  score: number;
  passed: boolean;
  analysis: {
    strengthAreas: string[];
    weaknessAreas: string[];
    recommendations: string[];
    confidenceScore: number;
  };
};

const difficultyConfig: Record<
  string,
  { variant: "success" | "warning" | "destructive"; label: string }
> = {
  beginner: { variant: "success", label: "Beginner" },
  intermediate: { variant: "warning", label: "Intermediate" },
  advanced: { variant: "destructive", label: "Advanced" },
};

export default function AssessmentsPage() {
