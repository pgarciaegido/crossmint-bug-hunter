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
      "collectionId",
      `email:${report.userIdentifier}`
    );
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
