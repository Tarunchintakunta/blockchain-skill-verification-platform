import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { credentials, blockchainTransactions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  issueCredentialOnChain,
  generateCredentialHash,
} from "@/lib/blockchain";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (session.user as { role: string }).role;
    if (role !== "institution" && role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only institutions can issue on blockchain" },
        { status: 403 }
      );
    }

    const { credentialId } = await req.json();

    const credential = await db.query.credentials.findFirst({
      where: eq(credentials.id, credentialId),
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "Credential not found" },
        { status: 404 }
      );
    }

    const candidate = await db.query.users.findFirst({
      where: eq(users.id, credential.candidateId),
    });

    if (!candidate?.walletAddress) {
      return NextResponse.json(
        { success: false, error: "Candidate wallet address not configured" },
        { status: 400 }
      );
    }

    const credentialHash = generateCredentialHash({
      candidateId: credential.candidateId,
      issuerId: credential.issuerId,
      title: credential.title,
      skills: (credential.skillIds as string[]) || [],
      issuedAt: credential.issuedAt?.toISOString() || new Date().toISOString(),
    });

    const metadataURI = `ipfs://${credential.ipfsHash || "pending"}`;

    const { txHash, tokenId } = await issueCredentialOnChain(
      candidate.walletAddress,
      credentialHash,
      metadataURI
    );

    await db
      .update(credentials)
      .set({
        status: "verified",
        blockchainTxHash: txHash,
        tokenId,
        updatedAt: new Date(),
      })
      .where(eq(credentials.id, credentialId));

    const userId = (session.user as { id: string }).id;
    await db.insert(blockchainTransactions).values({
      userId,
      txHash,
      type: "credential_issue",
      status: "confirmed",
      metadata: { credentialId, tokenId },
    });

    return NextResponse.json({
      success: true,
      data: { txHash, tokenId },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Blockchain transaction failed" },
      { status: 500 }
    );
  }
}
