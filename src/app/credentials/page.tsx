"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Award,
  Shield,
  Clock,
  XCircle,
  ExternalLink,
  Plus,
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
import { Textarea } from "@/components/ui/textarea";
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
import { formatDate, truncateAddress } from "@/lib/utils";

type Credential = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  blockchainTxHash: string | null;
  tokenId: string | null;
  issuedAt: string | null;
  createdAt: string;
};

const statusConfig: Record<
  string,
  { icon: typeof Shield; variant: "success" | "default" | "warning" | "destructive"; label: string }
> = {
  verified: { icon: Shield, variant: "success", label: "Verified" },
  pending: { icon: Clock, variant: "warning", label: "Pending" },
