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
      "All assessment data is processed securely. Personal data is encrypted and controlled by the user with GDPR compliance.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description:
      "Verify any credential in seconds through the blockchain. No more waiting 5-10 business days for traditional verification.",
  },
  {
    icon: Globe,
    title: "Decentralized Trust",
    description:
      "No single point of failure. Credentials exist on the blockchain independently of any organization or platform.",
  },
];

const stats = [
  { value: "<5s", label: "Verification Time" },
  { value: "99.7%", label: "Tamper Resistance" },
  { value: "85%+", label: "Matching Accuracy" },
  { value: "1000+", label: "TPS Throughput" },
];

const roles = [
  {
    icon: Users,
    title: "For Candidates",
    points: [
      "Build a verified skill portfolio",
      "Take AI-powered assessments",
      "Get matched with ideal jobs",
      "Own your credentials forever",
    ],
  },
  {
    icon: Award,
    title: "For Institutions",
    points: [
      "Issue blockchain credentials",
      "Create skill assessments",
