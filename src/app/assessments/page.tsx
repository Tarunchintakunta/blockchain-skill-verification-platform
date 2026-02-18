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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchAssessments();
    }
  }, [status, router]);

  async function fetchAssessments() {
    const res = await fetch("/api/assessments");
    const data = await res.json();
    if (data.success) setAssessments(data.data);
    setLoading(false);
  }

  const user = session?.user as { name: string; email: string; role: string };
  const isInstitutionOrAdmin = user?.role === "institution" || user?.role === "admin";

  function handleStartAssessment(assessment: Assessment) {
    setAssessmentResult(null);
    setActiveAssessment(assessment);
  }

  function handleAssessmentComplete(result: SubmissionResult) {
    setAssessmentResult(result);
    fetchAssessments();
  }

  function handleCloseAssessment() {
    setActiveAssessment(null);
    setAssessmentResult(null);
  }

  if (activeAssessment) {
    if (assessmentResult) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Navbar user={user} />
          <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <ResultsView
              assessment={activeAssessment}
              result={assessmentResult}
              onClose={handleCloseAssessment}
            />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <AssessmentRunner
            assessment={activeAssessment}
            onComplete={handleAssessmentComplete}
            onCancel={handleCloseAssessment}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="mt-1 text-gray-500">
              {isInstitutionOrAdmin
                ? "Create and manage skill assessments"
                : "Test your skills and earn verified credentials"}
            </p>
          </div>

          {isInstitutionOrAdmin && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                  <DialogDescription>
                    Build a new skill assessment for candidates to complete.
                  </DialogDescription>
                </DialogHeader>
                <CreateAssessmentForm
                  onSuccess={() => {
                    setCreateDialogOpen(false);
                    fetchAssessments();
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : assessments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileCheck className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No assessments available
              </h3>
              <p className="mt-1 text-gray-500">
                {isInstitutionOrAdmin
                  ? "Create your first assessment to get started"
                  : "Check back later for new assessments"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment) => {
              const diff = difficultyConfig[assessment.difficulty] || difficultyConfig.beginner;
              const questionCount = assessment.questions?.length ?? 0;

              return (
                <Card
                  key={assessment.id}
                  className="hover:shadow-md transition-shadow flex flex-col"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                          <FileCheck className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
