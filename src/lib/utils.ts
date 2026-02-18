import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function calculateMatchScore(
  candidateSkills: { skillId: string; level: number; verified: boolean }[],
  requiredSkills: { skillId: string; minLevel: number }[],
  preferredSkills: { skillId: string; minLevel: number }[]
): number {
  if (requiredSkills.length === 0) return 0;

  let totalScore = 0;
  let maxScore = 0;

  for (const req of requiredSkills) {
    maxScore += 100;
    const candidate = candidateSkills.find((s) => s.skillId === req.skillId);
    if (candidate) {
      const levelMatch = Math.min(candidate.level / req.minLevel, 1) * 80;
      const verifiedBonus = candidate.verified ? 20 : 0;
      totalScore += levelMatch + verifiedBonus;
    }
  }

  for (const pref of preferredSkills) {
    maxScore += 50;
