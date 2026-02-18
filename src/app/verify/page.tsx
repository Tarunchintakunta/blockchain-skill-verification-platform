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
