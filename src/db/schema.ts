import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "candidate",
  "employer",
  "institution",
  "admin",
]);

export const credentialStatusEnum = pgEnum("credential_status", [
  "pending",
  "verified",
  "rejected",
  "revoked",
]);

export const assessmentStatusEnum = pgEnum("assessment_status", [
  "draft",
  "active",
  "completed",
  "expired",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "open",
  "closed",
  "filled",
  "draft",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "reviewed",
  "shortlisted",
  "rejected",
  "accepted",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("candidate"),
  walletAddress: varchar("wallet_address", { length: 42 }),
  avatar: text("avatar"),
  bio: text("bio"),
  organizationName: varchar("organization_name", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const credentials = pgTable("credentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => users.id),
  issuerId: uuid("issuer_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(),
  status: credentialStatusEnum("status").notNull().default("pending"),
  skillIds: jsonb("skill_ids").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 66 }),
  tokenId: varchar("token_id", { length: 78 }),
  ipfsHash: varchar("ipfs_hash", { length: 100 }),
  issuedAt: timestamp("issued_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skills.id),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id),
  status: assessmentStatusEnum("status").notNull().default("draft"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  duration: integer("duration").notNull(),
  passingScore: integer("passing_score").notNull().default(70),
  questions: jsonb("questions").$type<AssessmentQuestion[]>().default([]),
  totalAttempts: integer("total_attempts").default(0),
  averageScore: real("average_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentAttempts = pgTable("assessment_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => users.id),
  score: real("score"),
  passed: boolean("passed"),
  answers: jsonb("answers").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  aiAnalysis: jsonb("ai_analysis").$type<AIAnalysis>(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  employerId: uuid("employer_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  requiredSkillIds: jsonb("required_skill_ids").$type<string[]>().default([]),
  preferredSkillIds: jsonb("preferred_skill_ids")
    .$type<string[]>()
    .default([]),
  status: jobStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => users.id),
  status: applicationStatusEnum("status").notNull().default("pending"),
  matchScore: real("match_score"),
  coverLetter: text("cover_letter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSkills = pgTable("user_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skills.id),
  proficiencyLevel: integer("proficiency_level").notNull().default(0),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
