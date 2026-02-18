"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Award,
  FileCheck,
  Briefcase,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Credentials", href: "/credentials", icon: Award },
  { name: "Assessments", href: "/assessments", icon: FileCheck },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Verify", href: "/verify", icon: Shield },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                SkillChain
              </span>
