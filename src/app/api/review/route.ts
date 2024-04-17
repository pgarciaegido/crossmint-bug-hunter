import { CrossmintAdapter } from "@/services/CrossmintAdapter";
import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { ReportBugReview } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const body = (await request.json()) as ReportBugReview;

  const firebaseAdapter = new FirebaseAdapter();

  await firebaseAdapter.saveToDB("review_report", body);

  if (body.status === "approved") {
    const reportId = body.reportId;
    const report = await firebaseAdapter.getFromDBById("bug_report", reportId);
    await new CrossmintAdapter().mintNFT(
      process.env.COLLECTION_ID!,
      `email:${report.userIdentifier}`
    );
    // TODO: Send email to user
  } else {
    await firebaseAdapter.changeField(
      "bug_report",
      body.reportId,
      "status",
      "rejected"
    );
    // TODO: Send email to user
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
