import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { ReportBugReview } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const body = (await request.json()) as ReportBugReview;

  await new FirebaseAdapter().saveToDB("bug_report", {
    ...body,
    status: "pending",
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
