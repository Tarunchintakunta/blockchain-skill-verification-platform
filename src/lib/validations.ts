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

