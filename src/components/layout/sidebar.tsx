"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  FileCheck,
  Briefcase,
  User,
  Settings,
  Shield,
  BarChart3,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: string;
};

const candidateNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Credentials", href: "/credentials", icon: Award },
  { name: "Assessments", href: "/assessments", icon: FileCheck },
  { name: "Job Matches", href: "/jobs", icon: Briefcase },
  { name: "Blockchain", href: "/verify", icon: LinkIcon },
  { name: "Profile", href: "/profile", icon: User },
];

const employerNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/jobs?tab=candidates", icon: Users },
  { name: "Analytics", href: "/dashboard?tab=analytics", icon: BarChart3 },
  { name: "Verify", href: "/verify", icon: Shield },
  { name: "Profile", href: "/profile", icon: User },
];

const institutionNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Issue Credentials", href: "/credentials", icon: Award },
  { name: "Assessments", href: "/assessments", icon: FileCheck },
  { name: "Manage", href: "/dashboard?tab=manage", icon: Settings },
  { name: "Blockchain", href: "/verify", icon: LinkIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar({ role }: SidebarProps) {
