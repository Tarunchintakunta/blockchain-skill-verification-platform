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

  for (const req of job.requiredSkills) {
    const candidateSkill = candidate.skills.find(
      (s) => s.skillId === req.skillId
    );

    if (candidateSkill) {
      let skillScore =
        Math.min(candidateSkill.proficiencyLevel / req.minLevel, 1.2) * 100;

      if (candidateSkill.isVerified) {
        skillScore = Math.min(skillScore * verifiedMultiplier, 100);
        verifiedCount++;
      }

      requiredScore += skillScore;
      breakdown.push({
        skillName: req.skillName,
        matchScore: Math.round(skillScore),
        isVerified: candidateSkill.isVerified,
        candidateLevel: candidateSkill.proficiencyLevel,
        requiredLevel: req.minLevel,
      });
    } else {
      breakdown.push({
        skillName: req.skillName,
        matchScore: 0,
        isVerified: false,
        candidateLevel: 0,
        requiredLevel: req.minLevel,
      });
    }
  }

  for (const pref of job.preferredSkills) {
    const candidateSkill = candidate.skills.find(
      (s) => s.skillId === pref.skillId
    );

    if (candidateSkill) {
