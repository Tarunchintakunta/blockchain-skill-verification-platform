import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["candidate", "employer", "institution"]),
  organizationName: z.string().max(255).optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const credentialSchema = z.object({
  candidateId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.string().min(1).max(100),
  skillIds: z.array(z.string().uuid()),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const assessmentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  skillId: z.string().uuid(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.number().int().min(5).max(180),
  passingScore: z.number().int().min(1).max(100).default(70),
});

export const assessmentSubmissionSchema = z.object({
  assessmentId: z.string().uuid(),
  answers: z.record(z.string(), z.number()),
});
