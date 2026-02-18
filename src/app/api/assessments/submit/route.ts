import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { assessmentAttempts, assessments, userSkills } from "@/db/schema";
import { assessmentSubmissionSchema } from "@/lib/validations";
import { eq, sql } from "drizzle-orm";
import { analyzeAssessmentResults } from "@/lib/utils";
import type { AssessmentQuestion } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = assessmentSubmissionSchema.parse(body);
    const candidateId = (session.user as { id: string }).id;

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, validated.assessmentId),
    });

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      );
    }

    const questions = assessment.questions as AssessmentQuestion[];
    const result = analyzeAssessmentResults(validated.answers, questions);

    const [attempt] = await db
      .insert(assessmentAttempts)
      .values({
        assessmentId: validated.assessmentId,
        candidateId,
        score: result.score,
        passed: result.passed,
        answers: validated.answers,
        completedAt: new Date(),
        aiAnalysis: result.analysis,
      })
      .returning();

    await db
      .update(assessments)
      .set({
        totalAttempts: sql`${assessments.totalAttempts} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, validated.assessmentId));

    if (result.passed) {
      const existingSkill = await db.query.userSkills.findFirst({
        where: eq(userSkills.userId, candidateId),
      });

      if (!existingSkill) {
        await db.insert(userSkills).values({
          userId: candidateId,
          skillId: assessment.skillId,
          proficiencyLevel: Math.ceil(result.score / 20),
          isVerified: true,
          verifiedAt: new Date(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        result: {
          score: result.score,
          passed: result.passed,
          analysis: result.analysis,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
