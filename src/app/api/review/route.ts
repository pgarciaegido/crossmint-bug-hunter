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
  const crossmintAdapter = new CrossmintAdapter();

  await firebaseAdapter.saveToDB("review_report", body);

  if (body.status === "approved") {
    const reportId = body.reportId;
    const report = await firebaseAdapter.getFromDBById("bug_report", reportId);
    await firebaseAdapter.changeField(
      "bug_report",
      body.reportId,
      "status",
      "approved"
    );
    // TODO: Send email to user
    const nfts = await crossmintAdapter.getNFTsFromCollection(
      process.env.COLLECTION_ID!
    );

    console.log("-----", nfts);

    await crossmintAdapter.mintNFT(
      process.env.COLLECTION_ID!,
      `email:${report.userIdentifier}:polygon-amoy`
    );
  } else {
    await firebaseAdapter.changeField(
      "bug_report",
      body.reportId,
      "status",
      "rejected"
    );
    // TODO: Send email
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
