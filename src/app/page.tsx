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
      "Track credential lifecycle",
      "Build institutional reputation",
    ],
  },
  {
    icon: BarChart3,
    title: "For Employers",
    points: [
      "Verify skills instantly",
      "Find matched candidates",
      "Reduce hiring fraud",
      "Data-driven hiring decisions",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SkillChain</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-100 opacity-30 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-100 opacity-20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <Shield className="h-4 w-4" />
            Powered by Blockchain Technology
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Verify Skills with{" "}
            <span className="text-blue-600">Blockchain Trust</span>
