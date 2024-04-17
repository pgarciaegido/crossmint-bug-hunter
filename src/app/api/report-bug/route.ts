import { FirebaseAdapter } from "@/services/FirebaseAdapter";
import { NextRequest, NextResponse } from "next/server";

interface ReportBugBodyPayload {
  title: string;
  description: string;
  url: string;
  userIdentifier: string;
}

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const body = (await request.json()) as ReportBugBodyPayload;

  await new FirebaseAdapter().saveToDB(body);

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
