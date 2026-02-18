import Link from "next/link";
import {
  Shield,
  Award,
  Brain,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Globe,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Shield,
    title: "Blockchain Credentials",
    description:
      "Issue tamper-proof credentials as NFTs on the blockchain. Every credential is permanently verifiable and cannot be falsified.",
  },
  {
    icon: Brain,
    title: "AI-Powered Assessments",
    description:
      "Take skill assessments powered by AI that adapt to your level. Get detailed analysis and personalized recommendations.",
  },
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "ML algorithms match candidates with jobs based on verified skills, providing accurate and fair matching results.",
  },
  {
    icon: Lock,
    title: "Privacy-Preserving",
    description:
