type CandidateProfile = {
  skills: {
    skillId: string;
    skillName: string;
    proficiencyLevel: number;
    isVerified: boolean;
  }[];
};

type JobRequirements = {
  requiredSkills: { skillId: string; skillName: string; minLevel: number }[];
  preferredSkills: { skillId: string; skillName: string; minLevel: number }[];
};

type MatchResult = {
  overallScore: number;
  skillBreakdown: {
    skillName: string;
    matchScore: number;
    isVerified: boolean;
    candidateLevel: number;
    requiredLevel: number;
  }[];
  verifiedBonus: number;
  recommendation: string;
  confidence: number;
};

export function calculateJobMatch(
  candidate: CandidateProfile,
  job: JobRequirements
): MatchResult {
  const requiredWeight = 0.7;
  const preferredWeight = 0.3;
  const verifiedMultiplier = 1.25;

  let requiredScore = 0;
  let preferredScore = 0;
  let verifiedCount = 0;
  const breakdown: MatchResult["skillBreakdown"] = [];
