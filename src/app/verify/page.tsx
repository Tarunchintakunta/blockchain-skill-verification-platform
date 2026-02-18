"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  Hash,
  User,
  Building2,
  Copy,
  AlertTriangle,
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
import { formatDate, truncateAddress } from "@/lib/utils";

type VerificationData = {
  verified: boolean;
  onChain: boolean;
  holder?: string;
  issuer?: string;
  credentialHash?: string;
  issuedAt?: number;
  isValid?: boolean;
  error?: string;
};

type VerificationResult = {
  tokenId: string;
  queriedAt: string;
  data: VerificationData;
};

type CopyState = Record<string, boolean>;

export default function VerifyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");
  const [recentVerifications, setRecentVerifications] = useState<
    VerificationResult[]
  >([]);
  const [copyState, setCopyState] = useState<CopyState>({});

  // router is used for potential navigation; kept as a dependency guard
  void router;

  const user = session?.user as
    | { name: string; email: string; role: string }
    | undefined;

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = tokenInput.trim();

    if (!trimmed) {
      setError("Please enter a Token ID or Transaction Hash.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/blockchain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: trimmed }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      const verificationResult: VerificationResult = {
        tokenId: trimmed,
        queriedAt: new Date().toISOString(),
        data: json.data as VerificationData,
      };

      setResult(verificationResult);
      setRecentVerifications((prev) => {
        const filtered = prev.filter((v) => v.tokenId !== trimmed);
        return [verificationResult, ...filtered].slice(0, 5);
      });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyState((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch {
      // Clipboard API not available; silently ignore
    }
  }

  const howItWorksSteps = [
    {
      step: "01",
      icon: Building2,
      title: "Issue",
      description:
        "Institutions issue credentials as NFTs on the Polygon blockchain. Each credential receives a unique Token ID and is permanently recorded on-chain.",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      step: "02",
      icon: Search,
      title: "Verify",
      description:
        "Anyone can verify a credential by entering the Token ID above. The verification queries the blockchain directly, requiring no trust in any central authority.",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      step: "03",
      icon: Shield,
      title: "Trust",
      description:
        "Blockchain technology ensures credentials are tamper-proof and permanently recorded. Revoked credentials are instantly invalidated across the entire network.",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user ?? null} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Blockchain Credential Verifier
          </h1>
          <p className="mt-2 text-gray-500">
            Instantly verify any credential issued on the Polygon blockchain.
            No account required.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verify a Credential</CardTitle>
            <CardDescription>
              Enter the Token ID or Transaction Hash associated with a
              blockchain credential to verify its authenticity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Enter Token ID or Transaction Hash to verify"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="gap-2 shrink-0">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Result */}
        {result && (
          <Card className="mb-8 overflow-hidden">
            {/* Status Banner */}
            <div
              className={`px-6 py-5 ${
                result.data.isValid && result.data.onChain
                  ? "bg-emerald-50 border-b border-emerald-200"
                  : "bg-red-50 border-b border-red-200"
              }`}
            >
              <div className="flex items-center gap-4">
                {result.data.isValid && result.data.onChain ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {result.data.isValid && result.data.onChain
                      ? "Credential Verified"
                      : result.data.onChain && !result.data.isValid
                      ? "Credential Revoked"
                      : "Credential Invalid or Not Found"}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {result.data.isValid && result.data.onChain
                      ? "This credential is authentic and currently valid on the Polygon blockchain."
                      : result.data.onChain && !result.data.isValid
                      ? "This credential exists on-chain but has been revoked by the issuing institution."
                      : result.data.error ||
                        "No credential matching this Token ID was found on the blockchain."}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Queried at {formatDate(result.queriedAt)}
                  </p>
                </div>
                <div className="ml-auto shrink-0">
                  <Badge
                    variant={
                      result.data.isValid && result.data.onChain
                        ? "success"
                        : "destructive"
                    }
                  >
                    {result.data.isValid && result.data.onChain
                      ? "Valid"
                      : result.data.onChain && !result.data.isValid
                      ? "Revoked"
                      : "Not Found"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            {result.data.onChain && (
              <CardContent className="p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Credential Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Token ID */}
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                      <Hash className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500">
                        Token ID
                      </p>
