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
  rejected: { icon: XCircle, variant: "destructive", label: "Rejected" },
  revoked: { icon: XCircle, variant: "destructive", label: "Revoked" },
};

export default function CredentialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchCredentials();
    }
  }, [status, router]);

  async function fetchCredentials() {
    const res = await fetch("/api/credentials");
    const data = await res.json();
    if (data.success) setCredentials(data.data);
    setLoading(false);
  }

  const user = session?.user as { name: string; email: string; role: string };
  const isInstitution = user?.role === "institution";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isInstitution ? "Issued Credentials" : "My Credentials"}
            </h1>
            <p className="mt-1 text-gray-500">
              {isInstitution
                ? "Manage and issue blockchain-verified credentials"
                : "View and manage your verified credentials"}
            </p>
          </div>

          {isInstitution && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Issue Credential
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Issue New Credential</DialogTitle>
                  <DialogDescription>
                    Create a new blockchain-verified credential for a candidate.
                  </DialogDescription>
                </DialogHeader>
                <IssueCredentialForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    fetchCredentials();
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
        ) : credentials.length === 0 ? (
          <Card>
